import pandas as pd
import random
from datetime import datetime, timedelta
import numpy as np

random.seed(42)
np.random.seed(42)

print("="*60)
print("GENERATING COMPLETE ML TRAINING DATA")
print("="*60)

# ----------------------------
# CONFIG
# ----------------------------
NUM_STRUCTURES = 20  # More structures for better XGBoost training
DAYS_OF_DATA = 90    # 3 months of sensor data
READINGS_PER_DAY = 24  # Hourly readings per structure

ZONES = ["Zone-A", "Zone-B", "Zone-C", "Zone-D"]
SENSOR_TYPES = ["VIBRATION", "STRAIN", "PRESSURE", "TEMPERATURE"]
FAILURE_TYPES = ["FATIGUE", "OVERLOAD", "LEAK", "CORROSION", "THERMAL_STRESS"]
PRIORITY = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

BASE_DATE = datetime(2024, 1, 1, 0, 0)

# ----------------------------
# 1. STRUCTURE METADATA - Balanced risk classes
# ----------------------------
print("\n1️⃣  Generating structure metadata...")

structures = []

# LOW RISK (7 structures) - riskScore <= 0.5
for i in range(7):
    structures.append({
        "structureId": f"STR-{i+1:03}",
        "structureType": random.choice(["BRIDGE", "ROAD", "PIPELINE", "BUILDING"]),
        "zone": random.choice(ZONES),
        "expectedLifespanYears": random.randint(45, 70),
        "conditionScore": round(random.uniform(0.75, 0.95), 2),
        "riskScore": round(random.uniform(0.15, 0.48), 2),  # LOW
        "pastFailureCount": random.randint(0, 2)
    })

# MEDIUM RISK (7 structures) - 0.5 < riskScore <= 0.7
for i in range(7, 14):
    structures.append({
        "structureId": f"STR-{i+1:03}",
        "structureType": random.choice(["BRIDGE", "ROAD", "PIPELINE", "BUILDING"]),
        "zone": random.choice(ZONES),
        "expectedLifespanYears": random.randint(30, 50),
        "conditionScore": round(random.uniform(0.50, 0.75), 2),
        "riskScore": round(random.uniform(0.52, 0.68), 2),  # MEDIUM
        "pastFailureCount": random.randint(2, 5)
    })

# CRITICAL RISK (6 structures) - riskScore > 0.7
for i in range(14, 20):
    structures.append({
        "structureId": f"STR-{i+1:03}",
        "structureType": random.choice(["BRIDGE", "ROAD", "PIPELINE", "BUILDING"]),
        "zone": random.choice(ZONES),
        "expectedLifespanYears": random.randint(15, 35),
        "conditionScore": round(random.uniform(0.30, 0.55), 2),
        "riskScore": round(random.uniform(0.72, 0.95), 2),  # CRITICAL
        "pastFailureCount": random.randint(5, 10)
    })

df_struct = pd.DataFrame(structures)
df_struct.to_csv("structure_metadata.csv", index=False)
print(f"   ✓ Generated {len(df_struct)} structures")

# Verify class distribution
def severity_label(x):
    if x > 0.7: return 2
    if x > 0.5: return 1
    return 0

df_struct["_severity"] = df_struct["riskScore"].apply(severity_label)
print(f"   ✓ Risk distribution: Low={sum(df_struct['_severity']==0)}, Medium={sum(df_struct['_severity']==1)}, Critical={sum(df_struct['_severity']==2)}")

# ----------------------------
# 2. HISTORICAL FAILURES - Within sensor data timeframe
# ----------------------------
print("\n2️⃣  Generating historical failures...")

failures = []
failure_id = 0

# Generate failures throughout the data collection period
for struct in structures:
    sid = struct["structureId"]
    # More failures for higher risk structures
    risk = struct["riskScore"]
    if risk > 0.7:
        num_failures = random.randint(8, 15)
    elif risk > 0.5:
        num_failures = random.randint(4, 8)
    else:
        num_failures = random.randint(1, 4)
    
    for _ in range(num_failures):
        # Failures occur throughout the 90-day period
        days_offset = random.randint(5, DAYS_OF_DATA - 5)
        hour_offset = random.randint(0, 23)
        failure_time = BASE_DATE + timedelta(days=days_offset, hours=hour_offset)
        resolution_time = failure_time + timedelta(hours=random.randint(6, 72))
        
        failures.append({
            "failureId": f"F-{failure_id+1:03}",
            "structureId": sid,
            "failureType": random.choice(FAILURE_TYPES),
            "severity": random.choice(PRIORITY),
            "occurredAt": failure_time,
            "resolvedAt": resolution_time,
            "cause": f"{random.choice(FAILURE_TYPES)} due to environmental stress"
        })
        failure_id += 1

df_fail = pd.DataFrame(failures)
df_fail = df_fail.sort_values("occurredAt").reset_index(drop=True)
df_fail.to_csv("historical_failures.csv", index=False)
print(f"   ✓ Generated {len(df_fail)} failures")

# ----------------------------
# 3. SENSOR TELEMETRY - Aligned with failures
# ----------------------------
print("\n3️⃣  Generating sensor telemetry...")

telemetry = []
tel_id = 0

# Create a lookup for failures by structure and time
failure_times = {}
for _, f in df_fail.iterrows():
    sid = f["structureId"]
    if sid not in failure_times:
        failure_times[sid] = []
    failure_times[sid].append(f["occurredAt"])

for day in range(DAYS_OF_DATA):
    for hour in range(0, 24):
        current_time = BASE_DATE + timedelta(days=day, hours=hour)
        
        for struct in structures:
            sid = struct["structureId"]
            sensor_id = f"SEN-{int(sid.split('-')[1]):03}"
            
            # Check if failure is coming within 24 hours
            upcoming_failure = False
            if sid in failure_times:
                for ft in failure_times[sid]:
                    if current_time < ft <= current_time + timedelta(hours=24):
                        upcoming_failure = True
                        break
            
            rtype = random.choice(SENSOR_TYPES)
            
            # Generate sensor values - slightly elevated before failures
            if rtype == "VIBRATION":
                base_value = random.uniform(0.5, 2.5)
                if upcoming_failure:
                    base_value *= random.uniform(1.2, 1.8)  # Higher before failure
                value = round(base_value, 3)
                unit = "mm/s"
            elif rtype == "STRAIN":
                base_value = random.uniform(0.002, 0.008)
                if upcoming_failure:
                    base_value *= random.uniform(1.3, 2.0)
                value = round(base_value, 4)
                unit = "ratio"
            elif rtype == "PRESSURE":
                base_value = random.uniform(1.0, 3.5)
                if upcoming_failure:
                    base_value *= random.uniform(1.1, 1.5)
                value = round(base_value, 2)
                unit = "bar"
            else:  # TEMPERATURE
                base_value = random.uniform(20, 45)
                if upcoming_failure:
                    base_value += random.uniform(5, 15)  # Higher temp before failure
                value = round(base_value, 2)
                unit = "C"
            
            telemetry.append({
                "id": f"TEL-{tel_id}",
                "sensorId": sensor_id,
                "timestamp": current_time,
                "readingType": rtype,
                "value": value,
                "unit": unit,
                "createdAt": current_time
            })
            tel_id += 1

df_tel = pd.DataFrame(telemetry)
df_tel = df_tel.sort_values("timestamp").reset_index(drop=True)
df_tel.to_csv("sensor_telemetry.csv", index=False)
print(f"   ✓ Generated {len(df_tel)} sensor readings")

# ----------------------------
# 4. VERIFICATION
# ----------------------------
print("\n" + "="*60)
print("📊 DATA VERIFICATION")
print("="*60)

print(f"\nTimestamp Ranges:")
print(f"  Telemetry: {df_tel['timestamp'].min()} to {df_tel['timestamp'].max()}")
print(f"  Failures:  {df_fail['occurredAt'].min()} to {df_fail['occurredAt'].max()}")

tel_min = df_tel['timestamp'].min()
tel_max = df_tel['timestamp'].max()
fail_min = df_fail['occurredAt'].min()
fail_max = df_fail['occurredAt'].max()

if fail_max < tel_min or fail_min > tel_max:
    print("  ❌ NO OVERLAP!")
else:
    overlap_days = (min(tel_max, fail_max) - max(tel_min, fail_min)).days
    print(f"  ✓ TIMESTAMPS ALIGNED - {overlap_days} days overlap")

# Count how many readings have failures within 24h
matched = 0
for _, row in df_tel.iterrows():
    sid = f"STR-{int(row['sensorId'].split('-')[1]):03}"
    if sid in failure_times:
        for ft in failure_times[sid]:
            if row['timestamp'] < ft <= row['timestamp'] + timedelta(hours=24):
                matched += 1
                break

print(f"\nFailure Matching:")
print(f"  ✓ {matched}/{len(df_tel)} readings have failures within 24h ({matched/len(df_tel)*100:.1f}%)")

print(f"\nRisk Class Distribution:")
print(f"  Low Risk (0):      {sum(df_struct['_severity']==0)} structures")
print(f"  Medium Risk (1):   {sum(df_struct['_severity']==1)} structures")
print(f"  Critical Risk (2): {sum(df_struct['_severity']==2)} structures")

print("\n" + "="*60)
print("✅ ALL DATA GENERATED SUCCESSFULLY!")
print("="*60)
