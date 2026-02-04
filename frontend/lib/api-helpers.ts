/**
 * API Response Helper Utilities
 * Standardized response formats and error handling
 */

import { NextResponse } from "next/server";

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200,
) {
  return NextResponse.json(
    {
      success: true,
      ...data,
      ...(message && { message }),
    },
    { status },
  );
}

/**
 * Error response helper
 */
export function errorResponse(
  error: string,
  status: number = 400,
  details?: any,
) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(process.env.NODE_ENV === "development" && details && { details }),
    },
    { status },
  );
}

/**
 * Validation error response
 */
export function validationError(message: string) {
  return errorResponse(message, 400);
}

/**
 * Not found error response
 */
export function notFoundError(resource: string) {
  return errorResponse(`${resource} not found`, 404);
}

/**
 * Unauthorized error response
 */
export function unauthorizedError(message: string = "Unauthorized") {
  return errorResponse(message, 401);
}

/**
 * Forbidden error response
 */
export function forbiddenError(message: string = "Forbidden") {
  return errorResponse(message, 403);
}

/**
 * Conflict error response (duplicate resource)
 */
export function conflictError(message: string) {
  return errorResponse(message, 409);
}

/**
 * Internal server error response
 */
export function serverError(error: any) {
  console.error("Server error:", error);
  return errorResponse(
    "Internal server error",
    500,
    process.env.NODE_ENV === "development" ? String(error) : undefined,
  );
}

/**
 * Parse and validate pagination params
 */
export function parsePaginationParams(searchParams: URLSearchParams) {
  const limit = Math.min(
    Math.max(1, parseInt(searchParams.get("limit") || "50")),
    100,
  ); // Max 100 items per page
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0"));

  return { limit, offset };
}

/**
 * Create pagination response metadata
 */
export function createPaginationMeta(
  total: number,
  limit: number,
  offset: number,
) {
  return {
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[],
): string | null {
  const missingFields = requiredFields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === "";
  });

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  }

  return null;
}

/**
 * Validate GPS coordinates
 */
export function validateCoordinates(lat: number, lon: number): string | null {
  if (isNaN(lat) || isNaN(lon)) {
    return "Invalid coordinate values";
  }

  if (Math.abs(lat) > 90) {
    return "Latitude must be between -90 and 90";
  }

  if (Math.abs(lon) > 180) {
    return "Longitude must be between -180 and 180";
  }

  return null;
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Format error for logging
 */
export function formatErrorLog(endpoint: string, error: any, context?: any) {
  return {
    endpoint,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
  };
}
