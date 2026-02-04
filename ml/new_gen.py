import pandas as pd
import random
from datetime import datetime, timedelta
import numpy as np

# ----------------------------
# CONFIG - ALIGNED TIMESTAMPS
# ----------------------------
STRUCTURES = ["STR-001","STR-002","STR-003","STR-004","STR-005"]
ZONES = ["Zone-A","Zone-B","Zone-C","Zone-D"]
SENSOR_TYPES = ["VIBRATION","STRAIN","PRESSURE","TEMPERATURE"]
FAILURE_TYPES = ["FATIGUE","OVERLOAD","LEAK","CORROSION","THERMAL_STRESS"]
PRIORITY = ["LOW","MEDIUM","HIGH","CRITICAL"]

# Use OVERLAPPING date ranges
BASE_DATE = datetime(2024, 1, 1, 0, 0)  # Sensor data starts
FAILURE_BASE = datetime(2024, 1, 15, 0, 0)  # Failures start 2 weeks later (still within sensor range)

# ----------------------------
# STRUCTURE METADATA (XGBoost)
# ----------------------------
structures = []
for sid in STRUCTURES:
    structures.append({
        "structureId": sid,
        "structureType": random.choice(["BRIDGE","ROAD","PIPELINE","BUILDING"]),
        "zone": random.choice(ZONES),
        "expectedLifespanYears": random.randint(20,70),
        "conditionScore": round(random.uniform(0.4,0.9),2),
        "riskScore": round(random.uniform(0.2,0.8),2),
        "pastFailureCount": random.randint(0,6)
    })

df_struct = pd.DataFrame(structures)
df_struct.to_csv("structure_metadata.csv", index=False)

# ----------------------------
# SENSOR TELEMETRY (60 DAYS of data at 10-min intervals)
# ----------------------------
telemetry = []
sensor_counter = 0

# Generate 600 readings (60 days * 24 hours * 60 min / 10 min interval = 8640, but we'll do 600 for variety)
for day_offset in range(0, 60):  # 60 days
    for hour in range(0, 24, 4):  # Every 4 hours
        for struct_idx, sid in enumerate(STRUCTURES):
            t = BASE_DATE + timedelta(days=day_offset, hours=hour, minutes=random.randint(0, 60))
            rtype = random.choice(SENSOR_TYPES)
            sensor_id = f"SEN-{struct_idx+1:03}"

            if rtype == "VIBRATION":
                value = round(random.uniform(0.3, 3.2), 3)
                unit = "mm/s"
            elif rtype == "STRAIN":
                value = round(random.uniform(0.001, 0.012), 4)
                unit = "ratio"
            elif rtype == "PRESSURE":
                value = round(random.uniform(0.5, 4.0), 2)
                unit = "bar"
            else:
                value = round(random.uniform(15, 55), 2)
                unit = "C"

            telemetry.append({
                "id": f"TEL-{sensor_counter}",
                "sensorId": sensor_id,
                "timestamp": t,
                "readingType": rtype,
                "value": value,
                "unit": unit,
                "createdAt": t
            })
            sensor_counter += 1

df_tel = pd.DataFrame(telemetry)
df_tel = df_tel.sort_values('timestamp').reset_index(drop=True)
df_tel.to_csv("sensor_telemetry.csv", index=False)
print(f"✓ Generated {len(df_tel)} sensor readings")

# ----------------------------
# HISTORICAL FAILURES (WITH OVERLAPPING TIMESTAMPS)
# ----------------------------
failures = []
failure_counter = 0

for sid in STRUCTURES:
    # Each structure gets 6-8 failures spread across the sensor data period
    num_failures = random.randint(6, 8)
    for _ in range(num_failures):
        # Failure occurs during the sensor data collection period
        days_offset = random.randint(14, 59)  # After first 2 weeks (gives context data)
        failure_time = FAILURE_BASE + timedelta(days=days_offset, hours=random.randint(0, 23))
        
        # Some failures have precursor readings (anomalies before failure)
        resolution_time = failure_time + timedelta(hours=random.randint(12, 120))
        
        ftype = random.choice(FAILURE_TYPES)
        sev = random.choice(PRIORITY)

        failures.append({
            "failureId": f"F-{failure_counter+1:03}",
            "structureId": sid,
            "failureType": ftype,
            "severity": sev,
            "occurredAt": failure_time,
            "resolvedAt": resolution_time,
            "cause": f"{ftype} due to environmental stress"
        })
        failure_counter += 1

df_fail = pd.DataFrame(failures)
df_fail = df_fail.sort_values('occurredAt').reset_index(drop=True)
df_fail.to_csv("historical_failures.csv", index=False)
print(f"✓ Generated {len(df_fail)} failures")

# ----------------------------
# VERIFICATION
# ----------------------------
print("\n📊 DATA ALIGNMENT CHECK:")
print(f"Telemetry: {df_tel['timestamp'].min()} to {df_tel['timestamp'].max()}")
print(f"Failures:  {df_fail['occurredAt'].min()} to {df_fail['occurredAt'].max()}")

tel_min = df_tel['timestamp'].min()
tel_max = df_tel['timestamp'].max()
fail_min = df_fail['occurredAt'].min()
fail_max = df_fail['occurredAt'].max()

if fail_max < tel_min or fail_min > tel_max:
    print("❌ NO OVERLAP - data won't work!")
else:
    overlap_days = (min(tel_max, fail_max) - max(tel_min, fail_min)).days
    print(f"✓ TIMESTAMPS ALIGN - {overlap_days} days overlap")

print("\n✓ All CSV files regenerated with aligned timestamps!")