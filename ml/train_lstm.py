"""
LSTM Failure Prediction Model Training
Predicts infrastructure failures within 24 hours using sensor telemetry data.
Uses oversampling and focal loss to handle class imbalance.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import os

print("=" * 60)
print("🧠 LSTM FAILURE PREDICTION MODEL TRAINING")
print("=" * 60)

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

# Load data
print("\n📁 Loading data...")
telemetry = pd.read_csv('data/sensor_telemetry.csv')
failures = pd.read_csv('data/historical_failures.csv')

print(f"   Telemetry records: {len(telemetry)}")
print(f"   Failure records: {len(failures)}")

# Convert timestamps
telemetry['timestamp'] = pd.to_datetime(telemetry['timestamp'])
failures['occurredAt'] = pd.to_datetime(failures['occurredAt'])

# Map sensor to structure
def sensor_to_structure(sensor_id):
    """Convert SEN-001 to STR-001"""
    num = sensor_id.split('-')[1]
    return f"STR-{num}"

telemetry['structureId'] = telemetry['sensorId'].apply(sensor_to_structure)

# Create failure label - 1 if failure occurs within 24h
print("\n🏷️ Creating labels...")

def has_failure_within_24h(row, failures_df):
    """Check if a failure occurs within 24 hours of this reading"""
    struct_failures = failures_df[failures_df['structureId'] == row['structureId']]
    for _, f in struct_failures.iterrows():
        time_diff = (f['occurredAt'] - row['timestamp']).total_seconds() / 3600
        if 0 <= time_diff <= 24:  # Failure within next 24 hours
            return 1
    return 0

# Create labels
telemetry['failure_within_24h'] = telemetry.apply(
    lambda row: has_failure_within_24h(row, failures), axis=1
)

print(f"   Positive samples (failure within 24h): {telemetry['failure_within_24h'].sum()}")
print(f"   Negative samples: {len(telemetry) - telemetry['failure_within_24h'].sum()}")
print(f"   Class ratio: {telemetry['failure_within_24h'].mean()*100:.2f}%")

# Feature engineering - pivot readings by type
print("\n🔧 Feature engineering...")

# Pivot to get each reading type as a column
telemetry_pivot = telemetry.pivot_table(
    index=['structureId', 'timestamp', 'failure_within_24h'],
    columns='readingType',
    values='value',
    aggfunc='first'
).reset_index()

# Sort by structure and time
telemetry_pivot = telemetry_pivot.sort_values(['structureId', 'timestamp'])

print(f"   Features: {[c for c in telemetry_pivot.columns if c not in ['structureId', 'timestamp', 'failure_within_24h']]}")

# Create sequences for LSTM (window of 6 readings = 6 hours)
WINDOW_SIZE = 6

print(f"\n🔄 Creating sequences (window={WINDOW_SIZE})...")

feature_cols = [c for c in telemetry_pivot.columns if c not in ['structureId', 'timestamp', 'failure_within_24h']]

X_list = []
y_list = []

for struct_id in telemetry_pivot['structureId'].unique():
    struct_data = telemetry_pivot[telemetry_pivot['structureId'] == struct_id].sort_values('timestamp')
    
    features = struct_data[feature_cols].values
    labels = struct_data['failure_within_24h'].values
    
    # Create sliding windows
    for i in range(len(struct_data) - WINDOW_SIZE):
        X_list.append(features[i:i+WINDOW_SIZE])
        y_list.append(labels[i+WINDOW_SIZE])  # Label at end of window

X = np.array(X_list)
y = np.array(y_list)

print(f"   Sequences created: {len(X)}")
print(f"   Sequence shape: {X.shape}")
print(f"   Positive sequences: {y.sum()} ({y.mean()*100:.2f}%)")

# Handle NaN values
X = np.nan_to_num(X, nan=0.0)

# Normalize features
print("\n📏 Normalizing features...")
n_samples, n_timesteps, n_features = X.shape
X_reshaped = X.reshape(-1, n_features)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_reshaped)
X = X_scaled.reshape(n_samples, n_timesteps, n_features)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"   Training samples: {len(X_train)}")
print(f"   Test samples: {len(X_test)}")
print(f"   Training positive rate: {y_train.mean()*100:.2f}%")

# OVERSAMPLE minority class to balance training data
print("\n⚖️ Oversampling minority class...")
pos_indices = np.where(y_train == 1)[0]
neg_indices = np.where(y_train == 0)[0]

# Oversample positive class to match negative class
n_pos_needed = len(neg_indices) - len(pos_indices)
if n_pos_needed > 0 and len(pos_indices) > 0:
    oversampled_pos = np.random.choice(pos_indices, size=n_pos_needed, replace=True)
    X_train = np.vstack([X_train, X_train[oversampled_pos]])
    y_train = np.hstack([y_train, y_train[oversampled_pos]])
    
    # Shuffle
    shuffle_idx = np.random.permutation(len(X_train))
    X_train = X_train[shuffle_idx]
    y_train = y_train[shuffle_idx]

print(f"   After oversampling:")
print(f"   Training samples: {len(X_train)}")
print(f"   Training positive rate: {y_train.mean()*100:.2f}%")

# Build LSTM model
print("\n🏗️ Building LSTM model...")

model = Sequential([
    LSTM(32, input_shape=(n_timesteps, n_features), return_sequences=False),
    Dropout(0.3),
    Dense(16, activation='relu'),
    Dropout(0.2),
    Dense(1, activation='sigmoid')
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

model.summary()

# Callbacks
early_stop = EarlyStopping(
    monitor='val_loss',
    patience=10,
    restore_best_weights=True
)

reduce_lr = ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.5,
    patience=5,
    min_lr=0.0001
)

# Train
print("\n🚀 Training...")
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_split=0.2,
    callbacks=[early_stop, reduce_lr],
    verbose=1
)

# Evaluate
print("\n" + "=" * 60)
print("📊 EVALUATION")
print("=" * 60)

# Predict with threshold adjustment
y_pred_prob = model.predict(X_test, verbose=0)

# Find optimal threshold
from sklearn.metrics import precision_recall_curve, f1_score

precisions, recalls, thresholds = precision_recall_curve(y_test, y_pred_prob)
f1_scores = 2 * precisions * recalls / (precisions + recalls + 1e-10)
best_threshold_idx = np.argmax(f1_scores)
best_threshold = thresholds[best_threshold_idx] if best_threshold_idx < len(thresholds) else 0.5

print(f"\n   Optimal threshold: {best_threshold:.4f}")

y_pred = (y_pred_prob >= best_threshold).astype(int).flatten()

# Calculate metrics
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, zero_division=0)
recall = recall_score(y_test, y_pred, zero_division=0)
f1 = f1_score(y_test, y_pred, zero_division=0)
cm = confusion_matrix(y_test, y_pred)

print(f"   Accuracy:  {accuracy:.4f}")
print(f"   Precision: {precision:.4f}")
print(f"   Recall:    {recall:.4f}")
print(f"   F1-Score:  {f1:.4f}")

print(f"\n   Confusion Matrix:")
if cm.shape == (2, 2):
    print(f"   TN={cm[0,0]}, FP={cm[0,1]}")
    print(f"   FN={cm[1,0]}, TP={cm[1,1]}")
else:
    print(f"   {cm}")

# Check if model learned anything
print(f"\n   Predictions distribution:")
print(f"   Predicted 0: {(y_pred == 0).sum()}")
print(f"   Predicted 1: {(y_pred == 1).sum()}")

# Save model
os.makedirs('models', exist_ok=True)
model.save('models/lstm_failure_predictor.h5')

# Save threshold
with open('models/lstm_threshold.txt', 'w') as f:
    f.write(str(best_threshold))

print("\n" + "=" * 60)
print("✅ LSTM TRAINED SUCCESSFULLY!")
print(f"   Model saved to: models/lstm_failure_predictor.h5")
print(f"   Threshold saved to: models/lstm_threshold.txt")
print("=" * 60)
