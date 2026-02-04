// ML Service - Interface to FastAPI ML models
const ML_API_BASE = process.env.ML_API_URL || 'http://localhost:8002';

// Request format matching FastAPI endpoints
export interface SensorReading {
  value: number;
  readingType: 'TEMPERATURE' | 'VIBRATION' | 'STRAIN' | 'PRESSURE';
}

export interface AnomalyDetectionRequest {
  readings: SensorReading[];
}

export interface AnomalyResult {
  value: number;
  readingType: string;
  isAnomaly: boolean;
  anomalyScore: number;
}

export interface AnomalyDetectionResponse {
  results: AnomalyResult[];
  totalReadings: number;
  anomaliesDetected: number;
  anomalyRate: number;
}

export interface SensorSequence {
  timestamp: string;
  sensorId: string;
  readingType: 'TEMPERATURE' | 'VIBRATION' | 'STRAIN' | 'PRESSURE';
  value: number;
}

export interface FailurePredictionRequest {
  readings: SensorSequence[];
}

export interface FailurePredictionResult {
  structureId: string;
  failureProbability: number;
  failureRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';
  predictedFailureWithin24h: boolean;
}

export interface FailurePredictionResponse {
  predictions: FailurePredictionResult[];
  modelThreshold: number;
}

export class MLService {
  /**
   * Call Isolation Forest model for anomaly detection
   */
  static async detectAnomaly(
    request: AnomalyDetectionRequest
  ): Promise<AnomalyDetectionResponse> {
    const response = await fetch(`${ML_API_BASE}/anomaly/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anomaly detection failed: ${error}`);
    }

    return response.json();
  }

  /**
   * Call LSTM model for failure prediction
   */
  static async predictFailure(
    request: FailurePredictionRequest
  ): Promise<FailurePredictionResponse> {
    const response = await fetch(`${ML_API_BASE}/failure/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failure prediction failed: ${error}`);
    }

    return response.json();
  }

  /**
   * Map IoT reading types to ML model reading types
   */
  static mapReadingType(iotType: string): 'TEMPERATURE' | 'VIBRATION' | 'STRAIN' | 'PRESSURE' | null {
    const mapping: { [key: string]: 'TEMPERATURE' | 'VIBRATION' | 'STRAIN' | 'PRESSURE' | null } = {
      'TEMPERATURE': 'TEMPERATURE',
      'VIBRATION': 'VIBRATION',
      'PRESSURE': 'PRESSURE',
      'FLOW_RATE': 'STRAIN', // Map flow rate to strain
      'VOLTAGE': null,
      'CURRENT': null,
    };
    return mapping[iotType] || null;
  }
}
