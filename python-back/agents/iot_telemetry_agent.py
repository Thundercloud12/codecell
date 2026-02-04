"""
Agent A - IoT Telemetry Agent (Producer)
Purpose: Process raw sensor data before it reaches the map

Inputs: Kafka topic 'iot-telemetry-raw'

What it does:
- Cleans noisy readings
- Flags anomalies using Isolation Forest
- Aggregates by location
- Stores useful data in Postgres

Outputs:
- Publishes to 'iot-processed-topic'
- Updates: SensorTelemetry, UtilityAnomaly, MLAnomalyDetection
"""

import json
import logging
import numpy as np
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
from sklearn.ensemble import IsolationForest
from collections import defaultdict

logger = logging.getLogger(__name__)

# Anomaly detection thresholds per sensor type
ANOMALY_THRESHOLDS = {
    "VIBRATION_SENSOR": {"min": 0, "max": 10, "critical": 8},
    "PRESSURE_SENSOR": {"min": 20, "max": 100, "critical": 90},
    "TEMPERATURE_SENSOR": {"min": -10, "max": 60, "critical": 50},
    "WATER_METER": {"min": 0, "max": 1000, "critical": 800},
    "ENERGY_METER": {"min": 0, "max": 500, "critical": 450},
}

# Severity mapping
def get_severity(value: float, sensor_type: str) -> str:
    thresholds = ANOMALY_THRESHOLDS.get(sensor_type, {"min": 0, "max": 100, "critical": 80})
    critical = thresholds["critical"]
    max_val = thresholds["max"]
    
    if value >= critical:
        return "CRITICAL"
    elif value >= critical * 0.8:
        return "HIGH"
    elif value >= critical * 0.6:
        return "MEDIUM"
    return "LOW"


@dataclass
class ProcessedTelemetry:
    """Processed telemetry data structure"""
    sensor_id: str
    structure_id: str
    lat: float
    lng: float
    reading_type: str
    value: float
    unit: str
    anomaly: bool
    anomaly_score: float
    severity: str
    timestamp: str
    sensor_type: str


class IoTTelemetryAgent:
    """
    Agent A: Processes raw IoT telemetry data
    - Cleans noisy readings
    - Detects anomalies
    - Aggregates data
    """
    
    def __init__(self):
        self.isolation_forest = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_estimators=100
        )
        self.reading_history: Dict[str, List[float]] = defaultdict(list)
        self.model_fitted = False
        self.min_samples_for_training = 50
        logger.info("🔧 IoT Telemetry Agent initialized")
    
    def clean_reading(self, value: float, sensor_type: str) -> Optional[float]:
        """Clean noisy readings by applying bounds and smoothing"""
        thresholds = ANOMALY_THRESHOLDS.get(sensor_type, {"min": 0, "max": 1000})
        
        # Reject out-of-bounds readings
        if value < thresholds["min"] * 0.5 or value > thresholds["max"] * 1.5:
            logger.warning(f"Rejected out-of-bounds reading: {value} for {sensor_type}")
            return None
        
        # Clamp to valid range
        return max(thresholds["min"], min(value, thresholds["max"]))
    
    def detect_anomaly(self, sensor_id: str, value: float, sensor_type: str) -> tuple[bool, float]:
        """Detect anomalies using Isolation Forest and threshold-based detection"""
        # Add to history
        self.reading_history[sensor_id].append(value)
        
        # Keep only last 100 readings per sensor
        if len(self.reading_history[sensor_id]) > 100:
            self.reading_history[sensor_id] = self.reading_history[sensor_id][-100:]
        
        # Threshold-based detection
        thresholds = ANOMALY_THRESHOLDS.get(sensor_type, {"min": 0, "max": 100, "critical": 80})
        threshold_anomaly = value >= thresholds["critical"]
        
        # ML-based detection (Isolation Forest)
        ml_anomaly = False
        anomaly_score = 0.0
        
        # Train model when we have enough samples
        all_readings = []
        for readings in self.reading_history.values():
            all_readings.extend(readings)
        
        if len(all_readings) >= self.min_samples_for_training:
            try:
                X = np.array(all_readings).reshape(-1, 1)
                if not self.model_fitted or len(all_readings) % 50 == 0:
                    self.isolation_forest.fit(X)
                    self.model_fitted = True
                
                # Predict
                score = self.isolation_forest.decision_function([[value]])[0]
                prediction = self.isolation_forest.predict([[value]])[0]
                
                ml_anomaly = prediction == -1
                anomaly_score = abs(score)
            except Exception as e:
                logger.error(f"ML anomaly detection error: {e}")
        
        # Combine threshold and ML detection
        is_anomaly = threshold_anomaly or ml_anomaly
        
        return is_anomaly, anomaly_score
    
    def process_telemetry(self, raw_data: dict) -> Optional[ProcessedTelemetry]:
        """Process raw telemetry data and return processed result"""
        try:
            sensor_id = raw_data.get("sensorId") or raw_data.get("sensor_id")
            structure_id = raw_data.get("structureId") or raw_data.get("structure_id", "UNKNOWN")
            sensor_type = raw_data.get("sensorType") or raw_data.get("sensor_type", "UNKNOWN")
            reading_type = raw_data.get("readingType") or raw_data.get("reading_type", "UNKNOWN")
            value = float(raw_data.get("value", 0))
            unit = raw_data.get("unit", "")
            lat = float(raw_data.get("latitude") or raw_data.get("lat", 0))
            lng = float(raw_data.get("longitude") or raw_data.get("lng", 0))
            timestamp = raw_data.get("timestamp") or datetime.utcnow().isoformat()
            
            # Clean reading
            cleaned_value = self.clean_reading(value, sensor_type)
            if cleaned_value is None:
                return None
            
            # Detect anomaly
            is_anomaly, anomaly_score = self.detect_anomaly(sensor_id, cleaned_value, sensor_type)
            
            # Get severity
            severity = get_severity(cleaned_value, sensor_type) if is_anomaly else "LOW"
            
            return ProcessedTelemetry(
                sensor_id=sensor_id,
                structure_id=structure_id,
                lat=lat,
                lng=lng,
                reading_type=reading_type,
                value=cleaned_value,
                unit=unit,
                anomaly=is_anomaly,
                anomaly_score=anomaly_score,
                severity=severity,
                timestamp=timestamp,
                sensor_type=sensor_type
            )
        except Exception as e:
            logger.error(f"Error processing telemetry: {e}")
            return None
    
    def to_kafka_message(self, processed: ProcessedTelemetry) -> str:
        """Convert processed telemetry to Kafka message"""
        return json.dumps(asdict(processed))
    
    def aggregate_by_structure(self, readings: List[ProcessedTelemetry]) -> Dict[str, dict]:
        """Aggregate readings by structure for summary view"""
        aggregated = defaultdict(lambda: {
            "readings": [],
            "anomaly_count": 0,
            "max_severity": "LOW",
            "avg_value": 0
        })
        
        severity_order = {"LOW": 0, "MEDIUM": 1, "HIGH": 2, "CRITICAL": 3}
        
        for reading in readings:
            struct = aggregated[reading.structure_id]
            struct["readings"].append(reading)
            if reading.anomaly:
                struct["anomaly_count"] += 1
            if severity_order.get(reading.severity, 0) > severity_order.get(struct["max_severity"], 0):
                struct["max_severity"] = reading.severity
        
        # Calculate averages
        for struct_id, data in aggregated.items():
            if data["readings"]:
                data["avg_value"] = sum(r.value for r in data["readings"]) / len(data["readings"])
        
        return dict(aggregated)


# Singleton instance
iot_telemetry_agent = IoTTelemetryAgent()
