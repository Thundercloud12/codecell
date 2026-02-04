# Quick diagnostic
import pandas as pd
from datetime import timedelta

telemetry = pd.read_csv("data/sensor_telemetry.csv", parse_dates=["timestamp"])
failures = pd.read_csv("data/historical_failures.csv", parse_dates=["occurredAt"])

print("Telemetry timestamp range:")
print(f"  Min: {telemetry['timestamp'].min()}")
print(f"  Max: {telemetry['timestamp'].max()}")

print("\nFailures timestamp range:")
print(f"  Min: {failures['occurredAt'].min()}")
print(f"  Max: {failures['occurredAt'].max()}")

print("\nOverlap check:")
tel_min = telemetry['timestamp'].min()
tel_max = telemetry['timestamp'].max()
fail_min = failures['occurredAt'].min()
fail_max = failures['occurredAt'].max()

if fail_max < tel_min or fail_min > tel_max:
    print("❌ NO OVERLAP - timestamps don't align!")
else:
    print("✓ Timestamps overlap")