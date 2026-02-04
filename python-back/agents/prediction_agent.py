"""
Agent C - Prediction Agent
Purpose: Use ML results from the database for failure prediction

Reads from:
- MLFailurePrediction
- MLAnomalyDetection

What it does:
- Aggregates ML predictions by structure
- Calculates risk scores
- Identifies structures with imminent failures

Outputs:
- Publishes to 'predictions-topic'
"""

import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict

logger = logging.getLogger(__name__)


@dataclass
class StructurePrediction:
    """Prediction data for a structure"""
    structure_id: str
    structure_name: str
    lat: float
    lng: float
    failure_risk: str  # LOW, MEDIUM, HIGH, CRITICAL
    failure_probability: float
    predicted_within_24h: bool
    confidence_score: float
    contributing_factors: List[str]
    anomaly_count: int
    last_anomaly_time: Optional[str]
    model_version: str
    timestamp: str


class PredictionAgent:
    """
    Agent C: Processes ML predictions from the database
    - Aggregates predictions by structure
    - Calculates composite risk scores
    - Identifies critical structures
    """
    
    def __init__(self):
        self.risk_weights = {
            "LOW": 0.25,
            "MEDIUM": 0.5,
            "HIGH": 0.75,
            "CRITICAL": 1.0
        }
        logger.info("🔮 Prediction Agent initialized")
    
    def process_predictions(
        self,
        ml_predictions: List[dict],
        ml_anomalies: List[dict],
        structures: List[dict]
    ) -> List[StructurePrediction]:
        """
        Process ML predictions and anomalies to create structure-level predictions
        
        Args:
            ml_predictions: List of MLFailurePrediction records from DB
            ml_anomalies: List of MLAnomalyDetection records from DB
            structures: List of Structure records from DB
        
        Returns:
            List of StructurePrediction objects
        """
        results = []
        
        # Index structures by ID
        structure_map = {s["id"]: s for s in structures}
        
        # Group predictions by structure
        predictions_by_structure: Dict[str, List[dict]] = {}
        for pred in ml_predictions:
            struct_id = pred.get("structureId") or pred.get("structure_id")
            if struct_id not in predictions_by_structure:
                predictions_by_structure[struct_id] = []
            predictions_by_structure[struct_id].append(pred)
        
        # Group anomalies by sensor/structure
        anomalies_by_sensor: Dict[str, List[dict]] = {}
        for anomaly in ml_anomalies:
            sensor_id = anomaly.get("sensorId") or anomaly.get("sensor_id")
            if sensor_id not in anomalies_by_sensor:
                anomalies_by_sensor[sensor_id] = []
            anomalies_by_sensor[sensor_id].append(anomaly)
        
        # Process each structure
        for struct_id, preds in predictions_by_structure.items():
            structure = structure_map.get(struct_id, {})
            
            # Get latest prediction
            latest_pred = max(preds, key=lambda x: x.get("predictedAt", ""))
            
            # Count recent anomalies for this structure's sensors
            anomaly_count = 0
            last_anomaly_time = None
            contributing_factors = []
            
            # Get sensors for this structure (from the prediction's contributing factors)
            factors = latest_pred.get("contributingFactors") or {}
            if isinstance(factors, str):
                try:
                    factors = json.loads(factors)
                except:
                    factors = {}
            
            if factors:
                contributing_factors = list(factors.keys())[:5]  # Top 5 factors
            
            # Calculate composite probability
            probability = latest_pred.get("failureProbability", 0)
            failure_risk = latest_pred.get("failureRisk", "LOW")
            predicted_24h = latest_pred.get("predictedFailure24h", False)
            confidence = latest_pred.get("confidenceScore", 0.5)
            
            # Create prediction
            prediction = StructurePrediction(
                structure_id=struct_id,
                structure_name=structure.get("name", "Unknown Structure"),
                lat=structure.get("latitude", 0),
                lng=structure.get("longitude", 0),
                failure_risk=failure_risk,
                failure_probability=round(probability, 2),
                predicted_within_24h=predicted_24h,
                confidence_score=round(confidence, 2),
                contributing_factors=contributing_factors,
                anomaly_count=anomaly_count,
                last_anomaly_time=last_anomaly_time,
                model_version=latest_pred.get("modelVersion", "unknown"),
                timestamp=datetime.utcnow().isoformat()
            )
            
            results.append(prediction)
        
        # Sort by risk (highest first)
        results.sort(key=lambda x: self.risk_weights.get(x.failure_risk, 0), reverse=True)
        
        return results
    
    def calculate_structure_risk(
        self,
        predictions: List[dict],
        anomalies: List[dict]
    ) -> dict:
        """Calculate composite risk score for a structure"""
        if not predictions:
            return {
                "risk": "LOW",
                "probability": 0.0,
                "predicted_24h": False
            }
        
        # Get max probability
        max_prob = max(p.get("failureProbability", 0) for p in predictions)
        
        # Check for 24h predictions
        any_24h = any(p.get("predictedFailure24h", False) for p in predictions)
        
        # Determine risk level
        if max_prob >= 0.8 or any_24h:
            risk = "CRITICAL"
        elif max_prob >= 0.6:
            risk = "HIGH"
        elif max_prob >= 0.4:
            risk = "MEDIUM"
        else:
            risk = "LOW"
        
        # Boost risk if many recent anomalies
        recent_anomalies = [
            a for a in anomalies
            if a.get("isAnomaly", False)
        ]
        
        if len(recent_anomalies) >= 5 and risk == "MEDIUM":
            risk = "HIGH"
        elif len(recent_anomalies) >= 10 and risk == "HIGH":
            risk = "CRITICAL"
        
        return {
            "risk": risk,
            "probability": max_prob,
            "predicted_24h": any_24h,
            "anomaly_count": len(recent_anomalies)
        }
    
    def get_critical_structures(
        self,
        predictions: List[StructurePrediction],
        threshold: str = "HIGH"
    ) -> List[StructurePrediction]:
        """Get structures at or above a risk threshold"""
        threshold_value = self.risk_weights.get(threshold, 0.5)
        return [
            p for p in predictions
            if self.risk_weights.get(p.failure_risk, 0) >= threshold_value
        ]
    
    def to_kafka_message(self, prediction: StructurePrediction) -> str:
        """Convert prediction to Kafka message"""
        return json.dumps(asdict(prediction))
    
    def get_prediction_summary(self, predictions: List[StructurePrediction]) -> dict:
        """Get summary statistics of all predictions"""
        if not predictions:
            return {
                "total": 0,
                "critical": 0,
                "high": 0,
                "medium": 0,
                "low": 0,
                "predicted_24h_count": 0
            }
        
        return {
            "total": len(predictions),
            "critical": sum(1 for p in predictions if p.failure_risk == "CRITICAL"),
            "high": sum(1 for p in predictions if p.failure_risk == "HIGH"),
            "medium": sum(1 for p in predictions if p.failure_risk == "MEDIUM"),
            "low": sum(1 for p in predictions if p.failure_risk == "LOW"),
            "predicted_24h_count": sum(1 for p in predictions if p.predicted_within_24h)
        }


# Singleton instance
prediction_agent = PredictionAgent()
