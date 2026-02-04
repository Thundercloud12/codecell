/**
 * Ticket Lifecycle Guard
 * Validates state transitions for ticket workflow
 * Prevents invalid status changes
 */

export type TicketStatus =
  | "DETECTED"
  | "RANKED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "AWAITING_VERIFICATION"
  | "RESOLVED"
  | "REJECTED";

/**
 * Valid state transitions for ticket lifecycle
 * Each status maps to an array of valid next statuses
 */
const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  DETECTED: ["RANKED", "REJECTED"], // Can rank or reject early
  RANKED: ["ASSIGNED", "REJECTED"], // Can assign or reject
  ASSIGNED: ["IN_PROGRESS", "RANKED", "REJECTED"], // Worker can start, or reassign/reject
  IN_PROGRESS: ["AWAITING_VERIFICATION", "ASSIGNED", "REJECTED"], // Complete or reassign
  AWAITING_VERIFICATION: ["RESOLVED", "REJECTED", "IN_PROGRESS"], // Admin approves/rejects or worker resubmits
  RESOLVED: [], // Terminal state (can only be reopened manually)
  REJECTED: ["RANKED"], // Can be re-evaluated
};

export interface TransitionValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Validate if a status transition is allowed
 * @param currentStatus Current ticket status
 * @param newStatus Desired new status
 * @returns Validation result with reason if invalid
 */
export function validateTransition(
  currentStatus: TicketStatus,
  newStatus: TicketStatus,
): TransitionValidationResult {
  // Same status is allowed (idempotent)
  if (currentStatus === newStatus) {
    return { isValid: true };
  }

  const allowedTransitions = VALID_TRANSITIONS[currentStatus];

  if (!allowedTransitions.includes(newStatus)) {
    return {
      isValid: false,
      reason: `Cannot transition from ${currentStatus} to ${newStatus}. Valid transitions: ${allowedTransitions.join(", ")}`,
    };
  }

  return { isValid: true };
}

/**
 * Get all valid next statuses for current status
 */
export function getValidNextStatuses(
  currentStatus: TicketStatus,
): TicketStatus[] {
  return VALID_TRANSITIONS[currentStatus];
}

/**
 * Check if a status is terminal (no valid transitions)
 */
export function isTerminalStatus(status: TicketStatus): boolean {
  return VALID_TRANSITIONS[status].length === 0;
}

/**
 * Validate transition with additional business rules
 * @param currentStatus Current status
 * @param newStatus Desired status
 * @param context Additional context for validation
 */
export function validateTransitionWithContext(
  currentStatus: TicketStatus,
  newStatus: TicketStatus,
  context: {
    hasAssignedWorker?: boolean;
    hasProofUploaded?: boolean;
  },
): TransitionValidationResult {
  // First check basic state machine
  const basicValidation = validateTransition(currentStatus, newStatus);
  if (!basicValidation.isValid) {
    return basicValidation;
  }

  // Additional business rules

  // Rule: Cannot start work without worker assignment
  if (newStatus === "IN_PROGRESS" && !context.hasAssignedWorker) {
    return {
      isValid: false,
      reason: "Cannot start work without assigned worker",
    };
  }

  // Rule: Cannot move to awaiting verification without proof
  if (newStatus === "AWAITING_VERIFICATION" && !context.hasProofUploaded) {
    return {
      isValid: false,
      reason: "Cannot request verification without uploading proof",
    };
  }

  return { isValid: true };
}

/**
 * Get human-readable description of status
 */
export function getStatusDescription(status: TicketStatus): string {
  const descriptions: Record<TicketStatus, string> = {
    DETECTED: "Pothole detected by system, awaiting ranking",
    RANKED: "Severity assessed, ready for assignment",
    ASSIGNED: "Worker assigned, pending start",
    IN_PROGRESS: "Worker actively repairing pothole",
    AWAITING_VERIFICATION: "Work completed, awaiting admin verification",
    RESOLVED: "Repair verified and completed",
    REJECTED: "Ticket rejected or work not approved",
  };

  return descriptions[status];
}

/**
 * Get workflow stage for UI display
 */
export function getWorkflowStage(status: TicketStatus): {
  stage: string;
  progress: number; // 0-100
} {
  const stages: Record<TicketStatus, { stage: string; progress: number }> = {
    DETECTED: { stage: "Detection", progress: 10 },
    RANKED: { stage: "Assessment", progress: 25 },
    ASSIGNED: { stage: "Assignment", progress: 40 },
    IN_PROGRESS: { stage: "Repair", progress: 65 },
    AWAITING_VERIFICATION: { stage: "Verification", progress: 85 },
    RESOLVED: { stage: "Completed", progress: 100 },
    REJECTED: { stage: "Rejected", progress: 0 },
  };

  return stages[status];
}

/**
 * Determine if status change requires notification
 */
export function requiresNotification(
  oldStatus: TicketStatus,
  newStatus: TicketStatus,
): {
  notifyWorker: boolean;
  notifyAdmin: boolean;
  notifyCitizen: boolean;
} {
  // Define notification rules
  const rules: Record<
    string,
    { notifyWorker: boolean; notifyAdmin: boolean; notifyCitizen: boolean }
  > = {
    "RANKED->ASSIGNED": {
      notifyWorker: true,
      notifyAdmin: false,
      notifyCitizen: false,
    },
    "ASSIGNED->IN_PROGRESS": {
      notifyWorker: false,
      notifyAdmin: false,
      notifyCitizen: true,
    },
    "IN_PROGRESS->AWAITING_VERIFICATION": {
      notifyWorker: false,
      notifyAdmin: true,
      notifyCitizen: false,
    },
    "AWAITING_VERIFICATION->RESOLVED": {
      notifyWorker: true,
      notifyAdmin: false,
      notifyCitizen: true,
    },
    "AWAITING_VERIFICATION->REJECTED": {
      notifyWorker: true,
      notifyAdmin: false,
      notifyCitizen: false,
    },
  };

  const key = `${oldStatus}->${newStatus}`;
  return (
    rules[key] || {
      notifyWorker: false,
      notifyAdmin: false,
      notifyCitizen: false,
    }
  );
}
