"""
Agent D - Map Orchestrator (Summarizer) — MOST IMPORTANT
Purpose: Aggregate all data sources into a unified payload for the UI map

Inputs (consumes):
- iot-processed-topic
- weather-processed-topic
- predictions-topic
- Prisma DB tables: Structure, Pothole, Ticket, UtilityAnomaly, FailureEvent, MaintenanceLog

Outputs:
- Single unified payload for UI with all layers
"""

import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict, field

logger = logging.getLogger(__name__)


@dataclass
class StructureLayer:
    """Structure data for map layer"""
    id: str
    name: str
    lat: float
    lng: float
    structure_type: str
    risk_score: float
    condition_score: float
    failure_risk: str
    zone: Optional[str] = None


@dataclass
class SensorLayer:
    """Sensor data for map layer"""
    id: str
    sensor_code: str
    lat: float
    lng: float
    sensor_type: str
    status: str  # ACTIVE, INACTIVE, ERROR
    last_heartbeat: Optional[str] = None
    structure_id: Optional[str] = None
    latest_value: Optional[float] = None
    latest_reading_type: Optional[str] = None


@dataclass
class AnomalyLayer:
    """Anomaly data for map layer"""
    id: str
    lat: float
    lng: float
    anomaly_type: str
    severity: str
    detected_at: str
    sensor_id: Optional[str] = None
    value: Optional[float] = None
    is_resolved: bool = False


@dataclass
class MLAnomalyLayer:
    """ML-detected anomaly for map layer"""
    id: str
    sensor_id: str
    lat: float
    lng: float
    reading_type: str
    value: float
    anomaly_score: float
    detected_at: str
    model_version: str


@dataclass
class PotholeLayer:
    """Pothole data for map layer"""
    id: str
    lat: float
    lng: float
    priority: str
    priority_score: Optional[float]
    ticket_id: Optional[str]
    image_url: Optional[str]
    road_name: Optional[str] = None
    created_at: Optional[str] = None


@dataclass
class TicketLayer:
    """Ticket data for map layer"""
    id: str
    ticket_number: str
    status: str
    pothole_count: int
    assigned_worker: Optional[str]
    eta: Optional[str]
    created_at: str


@dataclass
class MaintenanceLayer:
    """Maintenance log for map layer"""
    id: str
    lat: float
    lng: float
    log_type: str
    description: Optional[str]
    performed_at: str
    structure_id: str


@dataclass
class FailureEventLayer:
    """Failure event for map layer"""
    id: str
    structure_id: str
    lat: float
    lng: float
    failure_type: str
    severity: str
    occurred_at: str
    is_resolved: bool


@dataclass
class PredictionLayer:
    """ML prediction for map layer"""
    id: str
    structure_id: str
    lat: float
    lng: float
    failure_probability: float
    failure_risk: str
    predicted_within_24h: bool
    predicted_at: str


@dataclass
class WeatherLayer:
    """Weather data for map overlay"""
    city: str
    lat: float
    lng: float
    rain_intensity: str
    flood_risk: str
    visibility: str
    temperature: float
    condition: str
    timestamp: str


@dataclass
class TelemetryHeatmapPoint:
    """Heatmap data point for telemetry visualization"""
    lat: float
    lng: float
    intensity: float  # 0-1 normalized value
    reading_type: str


@dataclass
class MapPayload:
    """Complete map payload with all layers"""
    structures: List[StructureLayer] = field(default_factory=list)
    sensors: List[SensorLayer] = field(default_factory=list)
    anomalies: List[AnomalyLayer] = field(default_factory=list)
    ml_anomalies: List[MLAnomalyLayer] = field(default_factory=list)
    potholes: List[PotholeLayer] = field(default_factory=list)
    tickets: List[TicketLayer] = field(default_factory=list)
    maintenance: List[MaintenanceLayer] = field(default_factory=list)
    failures: List[FailureEventLayer] = field(default_factory=list)
    predictions: List[PredictionLayer] = field(default_factory=list)
    weather: Optional[WeatherLayer] = None
    heatmap: List[TelemetryHeatmapPoint] = field(default_factory=list)
    summary: Dict[str, Any] = field(default_factory=dict)
    generated_at: str = ""


class MapOrchestratorAgent:
    """
    Agent D: Map Orchestrator
    Aggregates all data sources into a unified map payload
    """
    
    def __init__(self):
        logger.info("🗺️ Map Orchestrator Agent initialized")
    
    def process_structures(self, structures: List[dict], predictions: List[dict] = None) -> List[StructureLayer]:
        """Process structure data for map layer"""
        predictions_map = {}
        if predictions:
            for pred in predictions:
                struct_id = pred.get("structureId") or pred.get("structure_id")
                if struct_id:
                    predictions_map[struct_id] = pred
        
        result = []
        for s in structures:
            pred = predictions_map.get(s["id"], {})
            
            result.append(StructureLayer(
                id=s["id"],
                name=s.get("name") or "Unknown Structure",
                lat=s.get("latitude") or 0,
                lng=s.get("longitude") or 0,
                structure_type=s.get("structureType") or "UNKNOWN",
                risk_score=pred.get("failureProbability", s.get("riskScore", 0)) or 0,
                condition_score=s.get("conditionScore") or 0,
                failure_risk=pred.get("failureRisk", "LOW"),
                zone=s.get("zone")
            ))
        
        return result
    
    def process_sensors(self, sensors: List[dict], telemetry: List[dict] = None) -> List[SensorLayer]:
        """Process sensor data for map layer"""
        # Get latest telemetry per sensor
        latest_telemetry = {}
        if telemetry:
            for t in telemetry:
                sensor_id = t.get("sensorId") or t.get("sensor_id")
                if sensor_id not in latest_telemetry:
                    latest_telemetry[sensor_id] = t
                elif t.get("timestamp", "") > latest_telemetry[sensor_id].get("timestamp", ""):
                    latest_telemetry[sensor_id] = t
        
        result = []
        for sensor in sensors:
            latest = latest_telemetry.get(sensor["id"], {})
            
            # Determine status
            status = "ACTIVE" if sensor.get("isActive", False) else "INACTIVE"
            last_heartbeat = sensor.get("lastHeartbeat")
            if last_heartbeat:
                try:
                    hb_time = datetime.fromisoformat(last_heartbeat.replace("Z", "+00:00"))
                    if (datetime.utcnow() - hb_time.replace(tzinfo=None)).total_seconds() > 300:
                        status = "STALE"
                except:
                    pass
            
            result.append(SensorLayer(
                id=sensor["id"],
                sensor_code=sensor.get("sensorCode") or sensor["id"][:8],
                lat=sensor.get("latitude") or 0,
                lng=sensor.get("longitude") or 0,
                sensor_type=sensor.get("sensorType") or "UNKNOWN",
                status=status,
                last_heartbeat=last_heartbeat,
                structure_id=sensor.get("structureId"),
                latest_value=latest.get("value"),
                latest_reading_type=latest.get("readingType")
            ))
        
        return result
    
    def process_anomalies(self, anomalies: List[dict], sensors: List[dict] = None) -> List[AnomalyLayer]:
        """Process utility anomalies for map layer"""
        sensors_map = {s["id"]: s for s in (sensors or [])}
        
        result = []
        for a in anomalies:
            sensor = sensors_map.get(a.get("sensorId"), {})
            
            result.append(AnomalyLayer(
                id=a["id"],
                lat=a.get("latitude") or sensor.get("latitude") or 0,
                lng=a.get("longitude") or sensor.get("longitude") or 0,
                anomaly_type=a.get("anomalyType") or "UNKNOWN",
                severity=a.get("severity") or "LOW",
                detected_at=a.get("detectedAt") or datetime.utcnow().isoformat(),
                sensor_id=a.get("sensorId"),
                value=a.get("detectedValue"),
                is_resolved=a.get("isResolved", False)
            ))
        
        return result
    
    def process_ml_anomalies(self, ml_anomalies: List[dict], sensors: List[dict] = None) -> List[MLAnomalyLayer]:
        """Process ML-detected anomalies for map layer"""
        sensors_map = {s["id"]: s for s in (sensors or [])}
        
        result = []
        for a in ml_anomalies:
            if not a.get("isAnomaly", False):
                continue
            
            sensor = sensors_map.get(a.get("sensorId"), {})
            
            result.append(MLAnomalyLayer(
                id=a["id"],
                sensor_id=a.get("sensorId") or "",
                lat=sensor.get("latitude") or 0,
                lng=sensor.get("longitude") or 0,
                reading_type=a.get("readingType") or "UNKNOWN",
                value=a.get("value") or 0,
                anomaly_score=a.get("anomalyScore") or 0,
                detected_at=a.get("detectedAt") or datetime.utcnow().isoformat(),
                model_version=a.get("modelVersion") or "unknown"
            ))
        
        return result
    
    def process_potholes(self, potholes: List[dict]) -> List[PotholeLayer]:
        """Process pothole data for map layer"""
        result = []
        for p in potholes:
            road_info = p.get("roadInfo") or {}
            
            result.append(PotholeLayer(
                id=p["id"],
                lat=p.get("latitude") or 0,
                lng=p.get("longitude") or 0,
                priority=p.get("priorityLevel") or "LOW",
                priority_score=p.get("priorityScore"),
                ticket_id=p.get("ticketId"),
                image_url=p.get("imageUrl"),
                road_name=road_info.get("roadName"),
                created_at=p.get("createdAt")
            ))
        
        return result
    
    def process_tickets(self, tickets: List[dict]) -> List[TicketLayer]:
        """Process ticket data for map layer"""
        result = []
        for t in tickets:
            worker = t.get("assignedWorker") or {}
            
            result.append(TicketLayer(
                id=t["id"],
                ticket_number=t.get("ticketNumber") or t["id"][:8],
                status=t.get("status") or "DETECTED",
                pothole_count=len(t.get("potholes", [])),
                assigned_worker=worker.get("name"),
                eta=t.get("estimatedETA"),
                created_at=t.get("createdAt") or datetime.utcnow().isoformat()
            ))
        
        return result
    
    def process_maintenance(self, logs: List[dict], structures: List[dict] = None) -> List[MaintenanceLayer]:
        """Process maintenance logs for map layer"""
        structures_map = {s["id"]: s for s in (structures or [])}
        
        result = []
        for log in logs:
            structure = structures_map.get(log.get("structureId"), {})
            
            result.append(MaintenanceLayer(
                id=log["id"],
                lat=log.get("latitude") or structure.get("latitude") or 0,
                lng=log.get("longitude") or structure.get("longitude") or 0,
                log_type=log.get("logType") or "UNKNOWN",
                description=log.get("description"),
                performed_at=log.get("performedAt") or datetime.utcnow().isoformat(),
                structure_id=log.get("structureId") or ""
            ))
        
        return result
    
    def process_failures(self, failures: List[dict], structures: List[dict] = None) -> List[FailureEventLayer]:
        """Process failure events for map layer"""
        structures_map = {s["id"]: s for s in (structures or [])}
        
        result = []
        for f in failures:
            structure = structures_map.get(f.get("structureId"), {})
            
            result.append(FailureEventLayer(
                id=f["id"],
                structure_id=f.get("structureId") or "",
                lat=structure.get("latitude") or 0,
                lng=structure.get("longitude") or 0,
                failure_type=f.get("failureType") or "UNKNOWN",
                severity=f.get("severity") or "LOW",
                occurred_at=f.get("occurredAt") or datetime.utcnow().isoformat(),
                is_resolved=f.get("resolvedAt") is not None
            ))
        
        return result
    
    def process_predictions(self, predictions: List[dict], structures: List[dict] = None) -> List[PredictionLayer]:
        """Process ML predictions for map layer"""
        structures_map = {s["id"]: s for s in (structures or [])}
        
        result = []
        for p in predictions:
            structure = structures_map.get(p.get("structureId"), {})
            
            result.append(PredictionLayer(
                id=p["id"],
                structure_id=p.get("structureId") or "",
                lat=structure.get("latitude") or 0,
                lng=structure.get("longitude") or 0,
                failure_probability=p.get("failureProbability") or 0,
                failure_risk=p.get("failureRisk") or "LOW",
                predicted_within_24h=p.get("predictedFailure24h", False),
                predicted_at=p.get("predictedAt") or datetime.utcnow().isoformat()
            ))
        
        return result
    
    def generate_heatmap(self, telemetry: List[dict], sensors: List[dict] = None) -> List[TelemetryHeatmapPoint]:
        """Generate heatmap points from telemetry data"""
        sensors_map = {s["id"]: s for s in (sensors or [])}
        
        # Find min/max values for normalization
        values = [t.get("value", 0) for t in telemetry if t.get("value") is not None]
        if not values:
            return []
        
        min_val, max_val = min(values), max(values)
        range_val = max_val - min_val if max_val != min_val else 1
        
        result = []
        for t in telemetry:
            sensor = sensors_map.get(t.get("sensorId"), {})
            lat = sensor.get("latitude")
            lng = sensor.get("longitude")
            
            if lat and lng:
                intensity = (t.get("value", 0) - min_val) / range_val
                result.append(TelemetryHeatmapPoint(
                    lat=lat,
                    lng=lng,
                    intensity=round(intensity, 3),
                    reading_type=t.get("readingType") or "UNKNOWN"
                ))
        
        return result
    
    def generate_summary(self, payload: MapPayload) -> Dict[str, Any]:
        """Generate summary statistics for the map"""
        return {
            "total_structures": len(payload.structures),
            "total_sensors": len(payload.sensors),
            "active_sensors": sum(1 for s in payload.sensors if s.status == "ACTIVE"),
            "total_anomalies": len(payload.anomalies),
            "unresolved_anomalies": sum(1 for a in payload.anomalies if not a.is_resolved),
            "ml_anomalies": len(payload.ml_anomalies),
            "total_potholes": len(payload.potholes),
            "critical_potholes": sum(1 for p in payload.potholes if p.priority == "CRITICAL"),
            "total_tickets": len(payload.tickets),
            "pending_tickets": sum(1 for t in payload.tickets if t.status not in ["RESOLVED", "REJECTED"]),
            "maintenance_logs": len(payload.maintenance),
            "failure_events": len(payload.failures),
            "unresolved_failures": sum(1 for f in payload.failures if not f.is_resolved),
            "high_risk_structures": sum(1 for s in payload.structures if s.failure_risk in ["HIGH", "CRITICAL"]),
            "predictions_24h": sum(1 for p in payload.predictions if p.predicted_within_24h),
            "weather_risk": payload.weather.flood_risk if payload.weather else "UNKNOWN"
        }
    
    def orchestrate(
        self,
        structures: List[dict] = None,
        sensors: List[dict] = None,
        telemetry: List[dict] = None,
        anomalies: List[dict] = None,
        ml_anomalies: List[dict] = None,
        potholes: List[dict] = None,
        tickets: List[dict] = None,
        maintenance: List[dict] = None,
        failures: List[dict] = None,
        predictions: List[dict] = None,
        weather: dict = None
    ) -> MapPayload:
        """
        Main orchestration method - aggregates all data into unified payload
        """
        payload = MapPayload(
            structures=self.process_structures(structures or [], predictions),
            sensors=self.process_sensors(sensors or [], telemetry),
            anomalies=self.process_anomalies(anomalies or [], sensors),
            ml_anomalies=self.process_ml_anomalies(ml_anomalies or [], sensors),
            potholes=self.process_potholes(potholes or []),
            tickets=self.process_tickets(tickets or []),
            maintenance=self.process_maintenance(maintenance or [], structures),
            failures=self.process_failures(failures or [], structures),
            predictions=self.process_predictions(predictions or [], structures),
            heatmap=self.generate_heatmap(telemetry or [], sensors),
            generated_at=datetime.utcnow().isoformat()
        )
        
        # Add weather if provided
        if weather:
            payload.weather = WeatherLayer(
                city=weather.get("city", "Unknown"),
                lat=weather.get("lat", 0),
                lng=weather.get("lng", 0),
                rain_intensity=weather.get("rainIntensity") or weather.get("rain_intensity", "NONE"),
                flood_risk=weather.get("floodRisk") or weather.get("flood_risk", "NONE"),
                visibility=weather.get("visibility", "GOOD"),
                temperature=weather.get("temperature", 0),
                condition=weather.get("condition") or weather.get("weather_condition", "Unknown"),
                timestamp=weather.get("timestamp", datetime.utcnow().isoformat())
            )
        
        # Generate summary
        payload.summary = self.generate_summary(payload)
        
        return payload
    
    def to_json(self, payload: MapPayload) -> str:
        """Convert payload to JSON string"""
        def serialize(obj):
            if hasattr(obj, '__dict__'):
                return {k: serialize(v) for k, v in asdict(obj).items()}
            elif isinstance(obj, list):
                return [serialize(item) for item in obj]
            elif isinstance(obj, dict):
                return {k: serialize(v) for k, v in obj.items()}
            return obj
        
        data = {
            "layers": {
                "structures": [asdict(s) for s in payload.structures],
                "sensors": [asdict(s) for s in payload.sensors],
                "anomalies": [asdict(a) for a in payload.anomalies],
                "mlAnomalies": [asdict(a) for a in payload.ml_anomalies],
                "potholes": [asdict(p) for p in payload.potholes],
                "tickets": [asdict(t) for t in payload.tickets],
                "maintenance": [asdict(m) for m in payload.maintenance],
                "failures": [asdict(f) for f in payload.failures],
                "predictions": [asdict(p) for p in payload.predictions],
                "heatmap": [asdict(h) for h in payload.heatmap],
                "weather": asdict(payload.weather) if payload.weather else None
            },
            "summary": payload.summary,
            "generatedAt": payload.generated_at
        }
        
        return json.dumps(data, default=str)


# Singleton instance
map_orchestrator = MapOrchestratorAgent()
