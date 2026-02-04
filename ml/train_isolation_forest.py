"""
Isolation Forest - Anomaly Detection for Sensor Readings
Detects unusual sensor values that may indicate equipment issues
"""
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder
import joblib
import os

print("="*60)
print("TRAINING ISOLATION FOREST (Anomaly Detection)")
print("="*60)

# Load data
df = pd.read_csv("data/sensor_telemetry.csv")
print(f"\n✓ Loaded {len(df)} sensor readings")

# Encode reading type
le = LabelEncoder()
df["readingTypeEnc"] = le.fit_transform(df["readingType"])

# Features
X = df[["value", "readingTypeEnc"]]
print(f"✓ Features: value, readingType (encoded)")

# Train model
print(f"\nTraining Isolation Forest...")
model = IsolationForest(
    n_estimators=300,
    contamination=0.04,  # Expect ~4% anomalies
    max_samples="auto",
    random_state=42,
    n_jobs=-1
)

model.fit(X)

# Save model and encoder
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/isolation_forest.pkl")
joblib.dump(le, "models/reading_type_encoder.pkl")

# Validate
predictions = model.predict(X)
n_anomalies = sum(predictions == -1)
pct = (n_anomalies / len(predictions)) * 100

print(f"\n📊 Training Results:")
print(f"   Anomalies detected: {n_anomalies}/{len(predictions)} ({pct:.2f}%)")
print(f"   Expected: ~4%")

print("\n" + "="*60)
print("✅ ISOLATION FOREST TRAINED SUCCESSFULLY!")
print("="*60)
