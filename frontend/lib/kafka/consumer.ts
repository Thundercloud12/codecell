/**
 * Kafka Consumer Background Worker
 * Processes IoT telemetry messages and stores them in Prisma DB
 */

import { KafkaMessage } from 'kafkajs';
import { createKafkaConsumer } from "./kafkaConfig";
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from "@prisma/adapter-pg";
import { MLService } from '../services/ml.service';

// Create Prisma client with adapter for Neon
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
  log: ['error'],
});

// Define enum types locally - these match the Prisma schema
type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type AnomalyType = 'WATER_LEAK' | 'PRESSURE_DROP' | 'POWER_SURGE' | 'OVERLOAD' | 'SENSOR_FAILURE';
type TelemetryType = 'FLOW_RATE' | 'PRESSURE' | 'VOLTAGE' | 'CURRENT' | 'POWER_USAGE' | 'VIBRATION' | 'TEMPERATURE';

interface TelemetryMessage {
  sensorCode: string;
  structureId: string;
  readingType: TelemetryType;
  value: number;
  unit: string;
  timestamp: string;
  topicName: string;
  metadata: {
    sensorType: string;
    isAnomaly: boolean;
  };
}

class KafkaConsumerWorker {
  private consumer;
  private isRunning = false;
  // ML batching: collect 6+ readings per structure for LSTM
  private telemetryBatch: Map<string, TelemetryMessage[]> = new Map();
  private readonly BATCH_SIZE = 6;

  constructor() {
    this.consumer = createKafkaConsumer('iot-telemetry-consumer');
  }

  /**
   * Define safe threshold ranges for anomaly detection
   */
  private getSafeThresholds(readingType: TelemetryType): { min: number; max: number } {
    const thresholds = {
      FLOW_RATE: { min: 20.0, max: 300.0 },
      PRESSURE: { min: 10.0, max: 400.0 }, 
      VOLTAGE: { min: 215.0, max: 245.0 },
      CURRENT: { min: 5.0, max: 75.0 },
      VIBRATION: { min: 0.1, max: 12.0 },
      TEMPERATURE: { min: -5.0, max: 50.0 },
      POWER_USAGE: { min: 0.0, max: 10000.0 }
    };
    
    return thresholds[readingType] || { min: 0, max: 100 };
  }

  /**
   * Determine anomaly type based on reading type and value
   */
  private determineAnomalyType(readingType: TelemetryType, value: number): AnomalyType {
    const thresholds = this.getSafeThresholds(readingType);
    
    if (readingType === 'FLOW_RATE' && value < thresholds.min * 0.5) {
      return 'WATER_LEAK';
    }
    
    if (readingType === 'PRESSURE' && value < thresholds.min) {
      return 'PRESSURE_DROP';
    }
    
    if (readingType === 'VOLTAGE' && (value < thresholds.min || value > thresholds.max)) {
      return 'POWER_SURGE';
    }
    
    if (readingType === 'CURRENT' && value > thresholds.max) {
      return 'OVERLOAD';
    }
    
    // Default to sensor failure for other anomalies
    return 'SENSOR_FAILURE';
  }

  /**
   * Calculate severity based on how far outside normal range
   */
  private calculateSeverity(readingType: TelemetryType, value: number): PriorityLevel {
    const thresholds = this.getSafeThresholds(readingType);
    const range = thresholds.max - thresholds.min;
    
    if (value < thresholds.min) {
      const deviation = (thresholds.min - value) / range;
      if (deviation > 2.0) return 'CRITICAL';
      if (deviation > 1.0) return 'HIGH';
      if (deviation > 0.5) return 'MEDIUM';
      return 'LOW';
    }
    
    if (value > thresholds.max) {
      const deviation = (value - thresholds.max) / range;
      if (deviation > 2.0) return 'CRITICAL';
      if (deviation > 1.0) return 'HIGH'; 
      if (deviation > 0.5) return 'MEDIUM';
      return 'LOW';
    }
    
    return 'LOW';
  }

  /**
   * Call ML Anomaly Detection (Isolation Forest) for a single reading
   */
  private async callMLAnomalyDetection(
    telemetryId: string,
    sensorId: string,
    message: TelemetryMessage
  ): Promise<void> {
    try {
      // Map IoT reading type to ML model type
      const mlReadingType = MLService.mapReadingType(message.readingType);
      if (!mlReadingType) {
        // Skip reading types not supported by ML model (e.g., VOLTAGE, CURRENT)
        return;
      }

      // Call Isolation Forest API (wraps single reading in array)
      const result = await MLService.detectAnomaly({
        readings: [{
          value: message.value,
          readingType: mlReadingType,
        }],
      });

      // Extract first result
      const anomalyResult = result.results[0];

      // Store ML anomaly detection result (use original IoT reading type, not mapped ML type)
      await prisma.mLAnomalyDetection.create({
        data: {
          telemetryId,
          sensorId,
          readingType: message.readingType, // Store original IoT type (FLOW_RATE, TEMPERATURE, etc.)
          value: message.value,
          isAnomaly: anomalyResult.isAnomaly,
          anomalyScore: anomalyResult.anomalyScore,
          modelVersion: 'isolation_forest_v1',
          detectedAt: new Date(message.timestamp),
        },
      });

      if (anomalyResult.isAnomaly) {
        console.log(
          `🤖 ML ANOMALY DETECTED: ${mlReadingType} = ${message.value}, score: ${anomalyResult.anomalyScore.toFixed(3)}`
        );
      }
    } catch (error) {
      console.error(`❌ ML Anomaly Detection failed for ${message.sensorCode}:`, error);
      // Don't throw - allow message processing to continue
    }
  }

  /**
   * Batch telemetry for LSTM failure prediction
   * Calls LSTM when we have 6+ readings for a structure
   */
  private async batchForFailurePrediction(
    structureId: string,
    message: TelemetryMessage
  ): Promise<void> {
    try {
      // Initialize batch array for structure if needed
      if (!this.telemetryBatch.has(structureId)) {
        this.telemetryBatch.set(structureId, []);
      }

      const batch = this.telemetryBatch.get(structureId)!;
      batch.push(message);

      // When batch reaches 6+ readings, call LSTM
      if (batch.length >= this.BATCH_SIZE) {
        await this.callMLFailurePrediction(structureId, batch);
        // Clear batch after prediction
        this.telemetryBatch.set(structureId, []);
      }
    } catch (error) {
      console.error(`❌ Batch processing failed for structure ${structureId}:`, error);
    }
  }

  /**
   * Call ML Failure Prediction (LSTM) with batched telemetry
   */
  private async callMLFailurePrediction(
    structureId: string,
    batch: TelemetryMessage[]
  ): Promise<void> {
    try {
      // Convert batch to SensorSequence format
      const readings = batch
        .map(msg => {
          const mlType = MLService.mapReadingType(msg.readingType);
          if (!mlType) return null;
          
          // Transform sensor code format: SENSOR_001 -> SENSOR-001
          const transformedSensorId = msg.sensorCode.replace(/_/g, '-');
          
          return {
            timestamp: new Date(msg.timestamp).toISOString(),
            sensorId: transformedSensorId,
            readingType: mlType,
            value: msg.value,
          };
        })
        .filter(r => r !== null) as any[];

      // Ensure we have at least 6 readings
      if (readings.length < 6) {
        console.warn(`⚠️ Not enough ML-compatible readings for LSTM (${readings.length}/6)`);
        return;
      }

      // Call LSTM API
      const result = await MLService.predictFailure({
        readings,
      });

      // Get prediction for this structure
      const prediction = result.predictions.find(p => p.structureId.includes(structureId.split('-').pop() || ''));
      if (!prediction) {
        console.warn(`⚠️ No prediction returned for structure ${structureId}`);
        return;
      }

      // Store LSTM prediction result
      await prisma.mLFailurePrediction.create({
        data: {
          structureId,
          failureProbability: prediction.failureProbability,
          failureRisk: prediction.failureRisk === 'UNKNOWN' ? 'LOW' : prediction.failureRisk,
          predictedFailure24h: prediction.predictedFailureWithin24h,
          confidenceScore: 0.85, // Default confidence
          contributingFactors: {},
          modelVersion: 'lstm_v1',
          modelThreshold: result.modelThreshold,
          predictionWindow: '24h',
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      console.log(
        `🔮 ML FAILURE PREDICTION: Structure ${structureId}, Risk: ${prediction.failureRisk}, Probability: ${(prediction.failureProbability * 100).toFixed(1)}%`
      );

      if (prediction.predictedFailureWithin24h) {
        console.warn(`⚠️ FAILURE PREDICTED within 24 hours!`);
      }
    } catch (error) {
      console.error(`❌ ML Failure Prediction failed for structure ${structureId}:`, error);
    }
  }

  /**
   * Process a single telemetry message
   */
  private async processMessage(message: TelemetryMessage): Promise<void> {
    try {
      console.log(`📨 Processing message from ${message.sensorCode}`);

      // 1. Lookup IoTSensor by sensorCode
      const sensor = await prisma.ioTSensor.findUnique({
        where: { sensorCode: message.sensorCode },
        include: { structure: true }
      });

      // 2. Discard if sensor doesn't exist
      if (!sensor) {
        console.warn(`⚠️ Sensor ${message.sensorCode} not found in database - discarding message`);
        return;
      }

      // 3. Discard if sensor is not subscribed
      if (!sensor.isSubscribed) {
        console.warn(`⚠️ Sensor ${message.sensorCode} not subscribed - discarding message`);
        return;
      }

      // 4. Discard if sensor is not active
      if (!sensor.isActive) {
        console.warn(`⚠️ Sensor ${message.sensorCode} not active - discarding message`);
        return;
      }

      // 5. Store telemetry data
      const telemetry = await prisma.sensorTelemetry.create({
        data: {
          sensorId: sensor.id,
          timestamp: new Date(message.timestamp),
          readingType: message.readingType,
          value: message.value,
          unit: message.unit,
          rawPayload: message as any
        }
      });

      console.log(`✅ Stored telemetry: ${message.sensorCode} = ${message.value} ${message.unit}`);

      // 6. Call ML Anomaly Detection (Isolation Forest)
      await this.callMLAnomalyDetection(telemetry.id, sensor.id, message);

      // 7. Update sensor heartbeat
      await prisma.ioTSensor.update({
        where: { id: sensor.id },
        data: { lastHeartbeat: new Date() }
      });

      // 8. Batch telemetry for LSTM failure prediction
      await this.batchForFailurePrediction(sensor.structure.id, message);

      // 9. Check for anomalies (legacy threshold-based)
      const thresholds = this.getSafeThresholds(message.readingType);
      const isOutsideThresholds = message.value < thresholds.min || message.value > thresholds.max;

      if (isOutsideThresholds || message.metadata.isAnomaly) {
        const anomalyType = this.determineAnomalyType(message.readingType, message.value);
        const severity = this.calculateSeverity(message.readingType, message.value);

        const anomaly = await prisma.utilityAnomaly.create({
          data: {
            sensorId: sensor.id,
            anomalyType,
            severity,
            detectedValue: message.value,
            expectedRange: `${thresholds.min}-${thresholds.max} ${message.unit}`,
            latitude: sensor.latitude,
            longitude: sensor.longitude,
            detectedAt: new Date(message.timestamp)
          }
        });

        console.warn(`🚨 ANOMALY CREATED: ${anomalyType} - ${severity} severity`);
        console.warn(`   Sensor: ${message.sensorCode}, Value: ${message.value} ${message.unit}`);
      }

    } catch (error) {
      console.error(`❌ Error processing message from ${message.sensorCode}:`, error);
      throw error; // Re-throw to trigger Kafka retry
    }
  }

  /**
   * Start the Kafka consumer
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('⚠️ Consumer already running');
      return;
    }

    try {
      console.log('🚀 Starting Kafka Consumer Worker...');

      // Subscribe to all IoT telemetry topics
      await this.consumer.subscribe({
        topics: [
          'iot.telemetry.water',
          'iot.telemetry.energy', 
          'iot.telemetry.pressure',
          'iot.telemetry.vibration'
        ]
      });

      console.log('📡 Subscribed to IoT telemetry topics');

      // Start consuming messages
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }: { 
          topic: string; 
          partition: number; 
          message: KafkaMessage 
        }) => {
          try {
            const telemetryData: TelemetryMessage = JSON.parse(message.value?.toString() || '{}');
            
            console.log(`📩 Received from ${topic} [${partition}]: ${telemetryData.sensorCode}`);
            
            await this.processMessage(telemetryData);
            
          } catch (error) {
            console.error(`❌ Failed to process message from ${topic}:`, error);
            // Message will be retried by Kafka
          }
        }
      });

      this.isRunning = true;
      console.log('✅ Kafka Consumer Worker started successfully');

    } catch (error) {
      console.error('❌ Failed to start Kafka consumer:', error);
      throw error;
    }
  }

  /**
   * Stop the consumer gracefully
   */
  public async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    console.log('🛑 Stopping Kafka Consumer Worker...');
    
    try {
      await this.consumer.stop();
      await this.consumer.disconnect();
      await prisma.$disconnect();
      
      this.isRunning = false;
      console.log('✅ Consumer stopped successfully');
      
    } catch (error) {
      console.error('❌ Error stopping consumer:', error);
    }
  }

  /**
   * Get consumer status
   */
  public isActive(): boolean {
    return this.isRunning;
  }
}

// Export singleton instance
export const kafkaConsumerWorker = new KafkaConsumerWorker();

// Note: Auto-start moved to worker.ts to avoid import issues