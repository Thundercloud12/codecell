"""
ML Models API
Exposes Isolation Forest, LSTM, and XGBoost models via REST endpoints
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np
import pandas as pd
import joblib
import os

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

from tensorflow.keras.models import load_model
from sklearn.preprocessing import StandardScaler

# =============================================================================
# Initialize FastAPI
# =============================================================================
app = FastAPI(
    title="Infrastructure ML Models API",
    description="""
    API for infrastructure monitoring ML models:
    - **Isolation Forest**: Anomaly detection in sensor readings
    - **LSTM**: Failure prediction within 24 hours
    - **XGBoost**: Risk severity classification (Low/Medium/Critical)
    """,
    version="1.0.0"
)

# =============================================================================
# Load Models
# =============================================================================
print("Loading ML models...")

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(SCRIPT_DIR, 'models')

# Isolation Forest
iso_model = joblib.load(os.path.join(MODELS_DIR, 'isolation_forest.pkl'))
reading_type_encoder = joblib.load(os.path.join(MODELS_DIR, 'reading_type_encoder.pkl'))
print("✓ Isolation Forest loaded")

# LSTM
lstm_model = load_model(os.path.join(MODELS_DIR, 'lstm_failure_predictor.h5'), compile=False)
lstm_threshold = 0.5
lstm_threshold_path = os.path.join(MODELS_DIR, 'lstm_threshold.txt')
if os.path.exists(lstm_threshold_path):
    with open(lstm_threshold_path, 'r') as f:
        lstm_threshold = float(f.read().strip())
print(f"✓ LSTM loaded (threshold: {lstm_threshold:.4f})")

# XGBoost
xgb_model = joblib.load(os.path.join(MODELS_DIR, 'xgboost_ranker.pkl'))
print("✓ XGBoost loaded")

print("All models loaded successfully!\n")

# =============================================================================
# Request/Response Models
# =============================================================================

# --- Isolation Forest ---
class SensorReading(BaseModel):
    """Single sensor reading for anomaly detection"""
    value: float = Field(..., description="Sensor reading value")
    readingType: str = Field(..., description="Type: TEMPERATURE, VIBRATION, STRAIN, PRESSURE")

class AnomalyRequest(BaseModel):
    """Request for anomaly detection"""
    readings: List[SensorReading] = Field(..., description="List of sensor readings to analyze")

class AnomalyResult(BaseModel):
    """Result for a single reading"""
    value: float
    readingType: str
    isAnomaly: bool
    anomalyScore: float

class AnomalyResponse(BaseModel):
    """Response from anomaly detection"""
    results: List[AnomalyResult]
    totalReadings: int
    anomaliesDetected: int
    anomalyRate: float

# --- LSTM ---
class SensorSequence(BaseModel):
    """Sensor reading with timestamp for LSTM"""
    timestamp: str = Field(..., description="ISO format timestamp")
    sensorId: str = Field(..., description="Sensor ID (e.g., SEN-001)")
    readingType: str = Field(..., description="Type: TEMPERATURE, VIBRATION, STRAIN, PRESSURE")
    value: float = Field(..., description="Sensor reading value")

class FailurePredictionRequest(BaseModel):
    """Request for failure prediction"""
    readings: List[SensorSequence] = Field(..., description="Time-series sensor readings (minimum 6 readings per sensor)")

class FailurePredictionResult(BaseModel):
    """Prediction result for a structure"""
    structureId: str
    failureProbability: float
    failureRisk: str  # "LOW", "MEDIUM", "HIGH"
    predictedFailureWithin24h: bool

class FailurePredictionResponse(BaseModel):
    """Response from failure prediction"""
    predictions: List[FailurePredictionResult]
    modelThreshold: float

# --- XGBoost ---
class StructureInfo(BaseModel):
    """Structure metadata for risk classification"""
    structureId: str = Field(..., description="Structure ID")
    expectedLifespanYears: float = Field(..., ge=0, description="Expected lifespan in years")
    conditionScore: float = Field(..., ge=0, le=1, description="Current condition (0-1)")
    riskScore: float = Field(..., ge=0, le=1, description="Risk score (0-1)")
    pastFailures: int = Field(..., ge=0, description="Number of past failures")

class RiskClassificationRequest(BaseModel):
    """Request for risk classification"""
    structures: List[StructureInfo] = Field(..., description="List of structures to classify")

class RiskClassificationResult(BaseModel):
    """Risk classification result"""
    structureId: str
    riskClass: int  # 0=Low, 1=Medium, 2=Critical
    riskLabel: str  # "Low", "Medium", "Critical"
    confidence: Optional[float] = None

class RiskClassificationResponse(BaseModel):
    """Response from risk classification"""
    classifications: List[RiskClassificationResult]
    featureImportance: dict

# =============================================================================
# API Endpoints
# =============================================================================

@app.get("/")
async def root():
    """API health check and info"""
    return {
        "status": "healthy",
        "models": {
            "isolation_forest": "Anomaly Detection",
            "lstm": "Failure Prediction (24h)",
            "xgboost": "Risk Severity Classification"
        },
        "endpoints": {
            "/anomaly/detect": "POST - Detect anomalies in sensor readings",
            "/failure/predict": "POST - Predict failures within 24 hours",
            "/risk/classify": "POST - Classify structure risk severity"
        }
    }

@app.get("/health")
async def health_check():
    """Simple health check"""
    return {"status": "ok", "models_loaded": True}

# --- Isolation Forest Endpoint ---
@app.post("/anomaly/detect", response_model=AnomalyResponse)
async def detect_anomalies(request: AnomalyRequest):
    """
    Detect anomalies in sensor readings using Isolation Forest.
    
    Returns whether each reading is anomalous and its anomaly score.
    """
    try:
        if not request.readings:
            raise HTTPException(status_code=400, detail="No readings provided")
        
        # Prepare data
        data = []
        for r in request.readings:
            # Encode reading type
            try:
                rt_encoded = reading_type_encoder.transform([r.readingType.upper()])[0]
            except ValueError:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Unknown reading type: {r.readingType}. Valid types: TEMPERATURE, VIBRATION, STRAIN, PRESSURE"
                )
            data.append({'value': r.value, 'readingTypeEnc': rt_encoded})
        
        df = pd.DataFrame(data)
        
        # Predict
        predictions = iso_model.predict(df)
        scores = iso_model.decision_function(df)
        
        # Build response
        results = []
        for i, r in enumerate(request.readings):
            results.append(AnomalyResult(
                value=r.value,
                readingType=r.readingType,
                isAnomaly=(predictions[i] == -1),
                anomalyScore=float(scores[i])
            ))
        
        anomalies = sum(1 for p in predictions if p == -1)
        
        return AnomalyResponse(
            results=results,
            totalReadings=len(results),
            anomaliesDetected=anomalies,
            anomalyRate=anomalies / len(results) if results else 0
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- LSTM Endpoint ---
@app.post("/failure/predict", response_model=FailurePredictionResponse)
async def predict_failures(request: FailurePredictionRequest):
    """
    Predict infrastructure failures within the next 24 hours using LSTM.
    
    Requires time-series sensor readings (minimum 6 readings per structure).
    """
    try:
        if not request.readings:
            raise HTTPException(status_code=400, detail="No readings provided")
        
        # Convert to DataFrame
        df = pd.DataFrame([{
            'timestamp': r.timestamp,
            'sensorId': r.sensorId,
            'readingType': r.readingType,
            'value': r.value
        } for r in request.readings])
        
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Map sensor to structure
        def sensor_to_structure(sensor_id):
            num = sensor_id.split('-')[1]
            return f"STR-{num}"
        
        df['structureId'] = df['sensorId'].apply(sensor_to_structure)
        
        # Pivot to get features per timestamp
        df_pivot = df.pivot_table(
            index=['structureId', 'timestamp'],
            columns='readingType',
            values='value',
            aggfunc='first'
        ).reset_index()
        
        df_pivot = df_pivot.sort_values(['structureId', 'timestamp'])
        
        feature_cols = [c for c in df_pivot.columns if c not in ['structureId', 'timestamp']]
        
        if len(feature_cols) == 0:
            raise HTTPException(status_code=400, detail="No valid sensor readings found")
        
        WINDOW_SIZE = 6
        predictions = []
        
        for struct_id in df_pivot['structureId'].unique():
            struct_data = df_pivot[df_pivot['structureId'] == struct_id].sort_values('timestamp')
            
            if len(struct_data) < WINDOW_SIZE:
                predictions.append(FailurePredictionResult(
                    structureId=struct_id,
                    failureProbability=0.0,
                    failureRisk="UNKNOWN",
                    predictedFailureWithin24h=False
                ))
                continue
            
            # Use last WINDOW_SIZE readings
            features = struct_data[feature_cols].tail(WINDOW_SIZE).values
            features = np.nan_to_num(features, nan=0.0)
            
            # Ensure correct shape (need 4 features to match training)
            if features.shape[1] < 4:
                # Pad with zeros
                padded = np.zeros((WINDOW_SIZE, 4))
                padded[:, :features.shape[1]] = features
                features = padded
            elif features.shape[1] > 4:
                features = features[:, :4]
            
            # Normalize
            scaler = StandardScaler()
            features_flat = features.reshape(-1, 4)
            features_scaled = scaler.fit_transform(features_flat)
            features = features_scaled.reshape(1, WINDOW_SIZE, 4)
            
            # Predict
            prob = float(lstm_model.predict(features, verbose=0)[0][0])
            is_failure = prob >= lstm_threshold
            
            # Determine risk level
            if prob < 0.3:
                risk = "LOW"
            elif prob < 0.7:
                risk = "MEDIUM"
            else:
                risk = "HIGH"
            
            predictions.append(FailurePredictionResult(
                structureId=struct_id,
                failureProbability=prob,
                failureRisk=risk,
                predictedFailureWithin24h=is_failure
            ))
        
        return FailurePredictionResponse(
            predictions=predictions,
            modelThreshold=lstm_threshold
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- XGBoost Endpoint ---
@app.post("/risk/classify", response_model=RiskClassificationResponse)
async def classify_risk(request: RiskClassificationRequest):
    """
    Classify structure risk severity using XGBoost.
    
    Returns Low (0), Medium (1), or Critical (2) risk classification.
    """
    try:
        if not request.structures:
            raise HTTPException(status_code=400, detail="No structures provided")
        
        # Prepare data
        data = []
        for s in request.structures:
            data.append({
                'structureId': s.structureId,
                'expectedLifespanYears': s.expectedLifespanYears,
                'conditionScore': s.conditionScore,
                'riskScore': s.riskScore,
                'pastFailures': s.pastFailures
            })
        
        df = pd.DataFrame(data)
        
        # Features
        feature_cols = ['expectedLifespanYears', 'conditionScore', 'riskScore', 'pastFailures']
        X = df[feature_cols]
        
        # Predict
        predictions = xgb_model.predict(X)
        
        # Get probabilities if available
        try:
            probas = xgb_model.predict_proba(X)
            confidences = [float(max(p)) for p in probas]
        except:
            confidences = [None] * len(predictions)
        
        # Build response
        labels = ['Low', 'Medium', 'Critical']
        results = []
        for i, s in enumerate(request.structures):
            results.append(RiskClassificationResult(
                structureId=s.structureId,
                riskClass=int(predictions[i]),
                riskLabel=labels[predictions[i]],
                confidence=confidences[i]
            ))
        
        # Feature importance
        importance = dict(zip(feature_cols, [float(x) for x in xgb_model.feature_importances_]))
        
        return RiskClassificationResponse(
            classifications=results,
            featureImportance=importance
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =============================================================================
# Run Server
# =============================================================================
if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("Starting ML Models API Server")
    print("="*60)
    print("\nEndpoints:")
    print("  POST /anomaly/detect  - Isolation Forest anomaly detection")
    print("  POST /failure/predict - LSTM failure prediction")
    print("  POST /risk/classify   - XGBoost risk classification")
    print("\nAPI Documentation: http://localhost:8000/docs")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
