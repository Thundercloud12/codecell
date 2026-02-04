/**
 * Severity Ranking Engine
 * Calculates priority score and level for potholes based on multiple factors
 *
 * Algorithm considers:
 * - Bounding box size (damage area)
 * - Model confidence
 * - Road priority factor
 * - Traffic weight
 */

export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface SeverityInput {
  bboxWidth: number;
  bboxHeight: number;
  confidence: number;
  roadPriorityFactor: number;
  trafficImportance: number;
}

export interface SeverityResult {
  priorityScore: number; // 0-100
  priorityLevel: PriorityLevel;
  breakdown: {
    damageScore: number;
    confidenceScore: number;
    roadScore: number;
    trafficScore: number;
  };
}

/**
 * Main severity ranking function
 * Produces a reproducible, explainable priority score
 *
 * @param input Pothole metrics and road context
 * @returns Priority score (0-100) and categorical level
 */
export function calculateSeverity(input: SeverityInput): SeverityResult {
  // 1. Damage Score (0-30 points) - based on bbox area
  const damageScore = calculateDamageScore(input.bboxWidth, input.bboxHeight);

  // 2. Confidence Score (0-20 points) - ML model confidence
  const confidenceScore = calculateConfidenceScore(input.confidence);

  // 3. Road Score (0-30 points) - road importance
  const roadScore = calculateRoadScore(input.roadPriorityFactor);

  // 4. Traffic Score (0-20 points) - traffic weight
  const trafficScore = calculateTrafficScore(input.trafficImportance);

  // Weighted sum to get final score (0-100)
  const priorityScore = Math.min(
    100,
    Math.round(damageScore + confidenceScore + roadScore + trafficScore),
  );

  // Determine categorical priority level
  const priorityLevel = determinePriorityLevel(priorityScore);

  return {
    priorityScore,
    priorityLevel,
    breakdown: {
      damageScore,
      confidenceScore,
      roadScore,
      trafficScore,
    },
  };
}

/**
 * Calculate damage score based on bounding box dimensions
 * Normalized bbox area (assuming relative coordinates 0-1)
 * Larger potholes = higher score
 *
 * Max: 30 points
 */
function calculateDamageScore(width: number, height: number): number {
  const area = width * height;

  // Area thresholds (relative to image size)
  // Small: < 0.01 (1% of image)
  // Medium: 0.01 - 0.05
  // Large: 0.05 - 0.1
  // Very Large: > 0.1

  let score = 0;

  if (area < 0.01) {
    score = 10; // Small pothole
  } else if (area < 0.05) {
    score = 20; // Medium pothole
  } else if (area < 0.1) {
    score = 25; // Large pothole
  } else {
    score = 30; // Very large / multiple potholes
  }

  return score;
}

/**
 * Calculate confidence score from model prediction
 * Higher confidence = more reliable detection = higher priority
 *
 * Max: 20 points
 */
function calculateConfidenceScore(confidence: number): number {
  // Confidence typically 0-1
  // Linear scaling to 0-20 points

  if (confidence >= 0.9) {
    return 20; // Very confident
  } else if (confidence >= 0.8) {
    return 17;
  } else if (confidence >= 0.7) {
    return 14;
  } else if (confidence >= 0.6) {
    return 10;
  } else {
    return 5; // Low confidence, needs verification
  }
}

/**
 * Calculate road importance score
 * Based on road priority factor from road-info service
 *
 * Max: 30 points
 */
function calculateRoadScore(priorityFactor: number): number {
  // Priority factor typically ranges 1.0 - 6.0
  // Scale to 0-30 points

  const normalized = Math.min(6.0, priorityFactor) / 6.0; // Normalize to 0-1
  return Math.round(normalized * 30);
}

/**
 * Calculate traffic importance score
 * Higher traffic = more people affected = higher priority
 *
 * Max: 20 points
 */
function calculateTrafficScore(trafficImportance: number): number {
  // Traffic importance typically ranges 0.5 - 5.0
  // Scale to 0-20 points

  const normalized = Math.min(5.0, trafficImportance) / 5.0; // Normalize to 0-1
  return Math.round(normalized * 20);
}

/**
 * Map numeric priority score to categorical level
 *
 * CRITICAL: 80-100 (motorways, large damage, high traffic)
 * HIGH: 60-79 (major roads, significant damage)
 * MEDIUM: 40-59 (secondary roads, moderate damage)
 * LOW: 0-39 (minor roads, small damage)
 */
function determinePriorityLevel(score: number): PriorityLevel {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

/**
 * Explain the severity calculation in human-readable format
 * Useful for admin interface and transparency
 */
export function explainSeverity(result: SeverityResult): string {
  const { priorityScore, priorityLevel, breakdown } = result;

  return `
Priority Score: ${priorityScore}/100 (${priorityLevel})

Breakdown:
- Damage Size: ${breakdown.damageScore}/30
- Detection Confidence: ${breakdown.confidenceScore}/20
- Road Importance: ${breakdown.roadScore}/30
- Traffic Weight: ${breakdown.trafficScore}/20

This pothole has been classified as ${priorityLevel} priority.
${getPriorityExplanation(priorityLevel)}
  `.trim();
}

function getPriorityExplanation(level: PriorityLevel): string {
  switch (level) {
    case "CRITICAL":
      return "Immediate action required. High-traffic road with significant damage.";
    case "HIGH":
      return "Should be addressed within 24-48 hours. Major road or substantial damage.";
    case "MEDIUM":
      return "Schedule for repair within 1 week. Moderate impact.";
    case "LOW":
      return "Can be scheduled with routine maintenance. Minor impact.";
  }
}
