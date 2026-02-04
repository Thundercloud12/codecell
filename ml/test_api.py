"""
Test the ML API endpoints
Run this while api.py is running on port 8000
"""
import requests
import json

BASE_URL = "http://localhost:8000"

print("=" * 60)
print("🧪 TESTING ML MODELS API")
print("=" * 60)

# Test 1: Health check
print("\n📍 Testing root endpoint...")
try:
    r = requests.get(f"{BASE_URL}/")
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        print("   ✅ API is healthy")
        print(f"   Response: {json.dumps(r.json(), indent=2)}")
except Exception as e:
    print(f"   ❌ Failed: {e}")

# Test 2: Anomaly Detection
print("\n📍 Testing /anomaly/detect...")
try:
    payload = {
        "readings": [
            {"value": 25.0, "readingType": "TEMPERATURE"},
            {"value": 150.0, "readingType": "TEMPERATURE"},  # Anomaly - too high
            {"value": 0.5, "readingType": "VIBRATION"},
            {"value": 10.0, "readingType": "VIBRATION"},  # Anomaly - too high
            {"value": 100.0, "readingType": "STRAIN"},
            {"value": 1000.0, "readingType": "PRESSURE"}
        ]
    }
    r = requests.post(f"{BASE_URL}/anomaly/detect", json=payload)
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(f"   ✅ Anomalies detected: {data['anomaliesDetected']}/{data['totalReadings']}")
        print(f"   Anomaly rate: {data['anomalyRate']*100:.1f}%")
    else:
        print(f"   ❌ Error: {r.text}")
except Exception as e:
    print(f"   ❌ Failed: {e}")

# Test 3: Failure Prediction
print("\n📍 Testing /failure/predict...")
try:
    # Create 6 sequential readings for one sensor
    from datetime import datetime, timedelta
    base_time = datetime(2024, 2, 1, 10, 0, 0)
    readings = []
    for i in range(6):
        for rt in ["TEMPERATURE", "VIBRATION", "STRAIN", "PRESSURE"]:
            readings.append({
                "timestamp": (base_time + timedelta(hours=i)).isoformat(),
                "sensorId": "SEN-001",
                "readingType": rt,
                "value": 50.0 if i < 3 else 120.0  # Elevated values in later readings
            })
    
    payload = {"readings": readings}
    r = requests.post(f"{BASE_URL}/failure/predict", json=payload)
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(f"   ✅ Model threshold: {data['modelThreshold']:.4f}")
        for pred in data['predictions']:
            print(f"   Structure {pred['structureId']}: {pred['failureRisk']} risk (prob: {pred['failureProbability']:.4f})")
    else:
        print(f"   ❌ Error: {r.text}")
except Exception as e:
    print(f"   ❌ Failed: {e}")

# Test 4: Risk Classification
print("\n📍 Testing /risk/classify...")
try:
    payload = {
        "structures": [
            {"structureId": "STR-001", "expectedLifespanYears": 50, "conditionScore": 0.9, "riskScore": 0.2, "pastFailures": 0},
            {"structureId": "STR-002", "expectedLifespanYears": 30, "conditionScore": 0.5, "riskScore": 0.6, "pastFailures": 2},
            {"structureId": "STR-003", "expectedLifespanYears": 10, "conditionScore": 0.3, "riskScore": 0.9, "pastFailures": 5}
        ]
    }
    r = requests.post(f"{BASE_URL}/risk/classify", json=payload)
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print("   ✅ Classifications:")
        for c in data['classifications']:
            print(f"      {c['structureId']}: {c['riskLabel']} (class {c['riskClass']}, confidence: {c['confidence']:.2f})")
        print(f"   Feature importance: {data['featureImportance']}")
    else:
        print(f"   ❌ Error: {r.text}")
except Exception as e:
    print(f"   ❌ Failed: {e}")

print("\n" + "=" * 60)
print("✅ API TESTING COMPLETE")
print("=" * 60)
