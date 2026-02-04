/**
 * Kafka Consumer Background Worker
 * Processes IoT telemetry messages and stores them in Prisma DB
 */

import { KafkaMessage } from 'kafkajs';
import { createKafkaConsumer } from "./kafkaConfig";
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from "@prisma/adapter-pg";

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

      // 6. Update sensor heartbeat
      await prisma.ioTSensor.update({
        where: { id: sensor.id },
        data: { lastHeartbeat: new Date() }
      });

      // 7. Check for anomalies
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