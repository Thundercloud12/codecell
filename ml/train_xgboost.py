"""
XGBoost - Risk Severity Classification
Classifies structures into Low/Medium/Critical risk categories
"""
import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import os

print("="*60)
print("TRAINING XGBOOST (Risk Severity Ranking)")
print("="*60)

# Load data
structures = pd.read_csv("data/structure_metadata.csv")
failures = pd.read_csv("data/historical_failures.csv")

print(f"\n✓ Loaded {len(structures)} structures")
print(f"✓ Loaded {len(failures)} failures")

# Compute failure counts per structure
failure_counts = failures.groupby("structureId").size().reset_index(name="pastFailures")
df = structures.merge(failure_counts, on="structureId", how="left")
df["pastFailures"] = df["pastFailures"].fillna(0)

# Create severity labels based on riskScore
def severity_label(x):
    if x > 0.7: return 2  # Critical
    if x > 0.5: return 1  # Medium
    return 0  # Low

df["severity"] = df["riskScore"].apply(severity_label)

print(f"\n📊 Class Distribution:")
for cls in [0, 1, 2]:
    count = sum(df["severity"] == cls)
    name = ["Low", "Medium", "Critical"][cls]
    print(f"   {name} Risk ({cls}): {count} structures")

# Features
feature_cols = ["expectedLifespanYears", "conditionScore", "riskScore", "pastFailures"]
X = df[feature_cols]
y = df["severity"]

print(f"\n✓ Features: {feature_cols}")
print(f"✓ Feature shape: {X.shape}")

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"✓ Training: {len(X_train)}, Testing: {len(X_test)}")

# Train model
print("\nTraining XGBoost...")
model = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=4,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    use_label_encoder=False,
    eval_metric='mlogloss'
)

model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

# Cross-validation
print("\nCross-validation (5-fold)...")
cv_scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"   CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std()*2:.4f})")

# Evaluate
print("\n" + "="*60)
print("📊 EVALUATION")
print("="*60)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f"   Test Accuracy: {accuracy:.4f}")

print(f"\n   Classification Report:")
print(classification_report(
    y_test, y_pred,
    target_names=["Low Risk", "Medium Risk", "Critical Risk"],
    zero_division=0
))

print(f"   Confusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
print(cm)

# Feature importance
print(f"\n   Feature Importance:")
importance = model.feature_importances_
for fname, imp in zip(feature_cols, importance):
    print(f"     {fname}: {imp:.4f}")

# Save
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/xgboost_ranker.pkl")

print("\n" + "="*60)
print("✅ XGBOOST TRAINED SUCCESSFULLY!")
print("="*60)
