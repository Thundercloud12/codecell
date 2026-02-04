import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/smart-map
 * Fetches all data for the Smart Infrastructure Map
 * Returns unified payload with all layers
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeResolved = searchParams.get("includeResolved") === "true";
    const limit = parseInt(searchParams.get("limit") || "500");

    // Fetch all data in parallel for performance
    const [
      structures,
      sensors,
      telemetry,
      anomalies,
      mlAnomalies,
      potholes,
      tickets,
      maintenance,
      failures,
      predictions,
    ] = await Promise.all([
      // Structures with basic info
      prisma.structure.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
      }),

      // IoT Sensors with structure relation
      prisma.ioTSensor.findMany({
        take: limit,
        include: {
          structure: {
            select: { id: true, name: true, latitude: true, longitude: true },
          },
        },
        orderBy: { installedAt: "desc" },
      }),

      // Recent telemetry (last 24 hours)
      prisma.sensorTelemetry.findMany({
        take: limit * 2,
        where: {
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        include: {
          sensor: {
            select: { id: true, latitude: true, longitude: true, sensorType: true },
          },
        },
        orderBy: { timestamp: "desc" },
      }),

      // Utility anomalies
      prisma.utilityAnomaly.findMany({
        take: limit,
        where: includeResolved ? {} : { isResolved: false },
        include: {
          sensor: {
            select: { id: true, latitude: true, longitude: true, sensorType: true },
          },
        },
        orderBy: { detectedAt: "desc" },
      }),

      // ML Anomalies (only flagged as anomalies)
      prisma.mLAnomalyDetection.findMany({
        take: limit,
        where: { isAnomaly: true },
        include: {
          sensor: {
            select: { id: true, latitude: true, longitude: true, sensorType: true },
          },
        },
        orderBy: { detectedAt: "desc" },
      }),

      // Potholes with road info
      prisma.pothole.findMany({
        take: limit,
        include: {
          roadInfo: {
            select: { roadName: true, roadType: true },
          },
          ticket: {
            select: { id: true, ticketNumber: true, status: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),

      // Tickets with workers and potholes count
      prisma.ticket.findMany({
        take: limit,
        where: includeResolved
          ? {}
          : { status: { notIn: ["RESOLVED", "REJECTED"] } },
        include: {
          assignedWorker: {
            select: { id: true, name: true, employeeId: true },
          },
          potholes: {
            select: { id: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),

      // Maintenance logs (recent)
      prisma.maintenanceLog.findMany({
        take: limit,
        include: {
          structure: {
            select: { id: true, name: true, latitude: true, longitude: true },
          },
        },
        orderBy: { performedAt: "desc" },
      }),

      // Failure events
      prisma.failureEvent.findMany({
        take: limit,
        where: includeResolved ? {} : { resolvedAt: null },
        include: {
          structure: {
            select: { id: true, name: true, latitude: true, longitude: true },
          },
        },
        orderBy: { occurredAt: "desc" },
      }),

      // ML Predictions (valid ones)
      prisma.mLFailurePrediction.findMany({
        take: limit,
        where: {
          OR: [
            { validUntil: null },
            { validUntil: { gte: new Date() } },
          ],
        },
        include: {
          structure: {
            select: { id: true, name: true, latitude: true, longitude: true },
          },
        },
        orderBy: { predictedAt: "desc" },
      }),
    ]);

    // Transform data into map layers format
    const layers = {
      structures: structures.map((s) => ({
        id: s.id,
        name: s.name || "Unknown Structure",
        lat: s.latitude || 0,
        lng: s.longitude || 0,
        structureType: s.structureType,
        riskScore: s.riskScore || 0,
        conditionScore: s.conditionScore || 0,
        failureRisk: getFailureRisk(s.riskScore || 0),
        zone: s.zone,
      })),

      sensors: sensors.map((s) => ({
        id: s.id,
        sensorCode: s.sensorCode,
        lat: s.latitude || s.structure?.latitude || 0,
        lng: s.longitude || s.structure?.longitude || 0,
        sensorType: s.sensorType,
        status: getSensorStatus(s),
        lastHeartbeat: s.lastHeartbeat?.toISOString(),
        structureId: s.structureId,
        isSubscribed: s.isSubscribed,
      })),

      telemetry: telemetry.map((t) => ({
        id: t.id,
        sensorId: t.sensorId,
        lat: t.sensor?.latitude || 0,
        lng: t.sensor?.longitude || 0,
        readingType: t.readingType,
        value: t.value,
        unit: t.unit,
        timestamp: t.timestamp.toISOString(),
      })),

      anomalies: anomalies.map((a) => ({
        id: a.id,
        lat: a.latitude || a.sensor?.latitude || 0,
        lng: a.longitude || a.sensor?.longitude || 0,
        anomalyType: a.anomalyType,
        severity: a.severity,
        detectedAt: a.detectedAt.toISOString(),
        sensorId: a.sensorId,
        value: a.detectedValue,
        isResolved: a.isResolved,
      })),

      mlAnomalies: mlAnomalies.map((a) => ({
        id: a.id,
        sensorId: a.sensorId,
        lat: a.sensor?.latitude || 0,
        lng: a.sensor?.longitude || 0,
        readingType: a.readingType,
        value: a.value,
        anomalyScore: a.anomalyScore,
        detectedAt: a.detectedAt.toISOString(),
        modelVersion: a.modelVersion,
      })),

      potholes: potholes.map((p) => ({
        id: p.id,
        lat: p.latitude,
        lng: p.longitude,
        priority: p.priorityLevel || "LOW",
        priorityScore: p.priorityScore,
        ticketId: p.ticketId,
        ticketNumber: p.ticket?.ticketNumber,
        ticketStatus: p.ticket?.status,
        imageUrl: p.imageUrl,
        roadName: p.roadInfo?.roadName,
        createdAt: p.createdAt.toISOString(),
      })),

      tickets: tickets.map((t) => ({
        id: t.id,
        ticketNumber: t.ticketNumber,
        status: t.status,
        potholeCount: t.potholes.length,
        assignedWorker: t.assignedWorker?.name,
        workerId: t.assignedWorkerId,
        eta: t.estimatedETA?.toISOString(),
        createdAt: t.createdAt.toISOString(),
      })),

      maintenance: maintenance.map((m) => ({
        id: m.id,
        lat: m.latitude || m.structure?.latitude || 0,
        lng: m.longitude || m.structure?.longitude || 0,
        logType: m.logType,
        description: m.description,
        performedAt: m.performedAt.toISOString(),
        structureId: m.structureId,
        structureName: m.structure?.name,
      })),

      failures: failures.map((f) => ({
        id: f.id,
        structureId: f.structureId,
        lat: f.structure?.latitude || 0,
        lng: f.structure?.longitude || 0,
        failureType: f.failureType,
        severity: f.severity,
        occurredAt: f.occurredAt.toISOString(),
        isResolved: f.resolvedAt !== null,
        structureName: f.structure?.name,
      })),

      predictions: predictions.map((p) => ({
        id: p.id,
        structureId: p.structureId,
        lat: p.structure?.latitude || 0,
        lng: p.structure?.longitude || 0,
        failureProbability: p.failureProbability,
        failureRisk: p.failureRisk,
        predictedWithin24h: p.predictedFailure24h,
        predictedAt: p.predictedAt.toISOString(),
        structureName: p.structure?.name,
      })),

      // Generate heatmap data from telemetry
      heatmap: generateHeatmap(telemetry),

      // Mock weather (can be replaced with real API call)
      weather: {
        city: "Mumbai",
        lat: 19.076,
        lng: 72.8777,
        rainIntensity: "LIGHT",
        floodRisk: "LOW",
        visibility: "GOOD",
        temperature: 28,
        condition: "Partly Cloudy",
        timestamp: new Date().toISOString(),
      },
    };

    // Generate summary statistics
    const summary = {
      totalStructures: structures.length,
      totalSensors: sensors.length,
      activeSensors: sensors.filter((s) => s.isActive).length,
      totalAnomalies: anomalies.length,
      unresolvedAnomalies: anomalies.filter((a) => !a.isResolved).length,
      mlAnomalies: mlAnomalies.length,
      totalPotholes: potholes.length,
      criticalPotholes: potholes.filter((p) => p.priorityLevel === "CRITICAL").length,
      totalTickets: tickets.length,
      pendingTickets: tickets.filter((t) => !["RESOLVED", "REJECTED"].includes(t.status)).length,
      maintenanceLogs: maintenance.length,
      failureEvents: failures.length,
      unresolvedFailures: failures.filter((f) => !f.resolvedAt).length,
      highRiskStructures: structures.filter((s) => (s.riskScore || 0) >= 0.6).length,
      predictions24h: predictions.filter((p) => p.predictedFailure24h).length,
    };

    return NextResponse.json({
      success: true,
      layers,
      summary,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Smart Map API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch map data" },
      { status: 500 }
    );
  }
}

// Helper functions
function getSensorStatus(sensor: { isActive: boolean; lastHeartbeat: Date | null }) {
  if (!sensor.isActive) return "INACTIVE";
  if (!sensor.lastHeartbeat) return "UNKNOWN";
  
  const minutesAgo = (Date.now() - sensor.lastHeartbeat.getTime()) / (1000 * 60);
  if (minutesAgo > 10) return "STALE";
  if (minutesAgo > 5) return "WARNING";
  return "ACTIVE";
}

function getFailureRisk(riskScore: number): string {
  if (riskScore >= 0.8) return "CRITICAL";
  if (riskScore >= 0.6) return "HIGH";
  if (riskScore >= 0.4) return "MEDIUM";
  return "LOW";
}

function generateHeatmap(telemetry: Array<{
  value: number;
  sensor?: { latitude: number | null; longitude: number | null } | null;
}>) {
  // Normalize values
  const values = telemetry.map((t) => t.value);
  if (values.length === 0) return [];
  
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  return telemetry
    .filter((t) => t.sensor?.latitude && t.sensor?.longitude)
    .slice(0, 200) // Limit heatmap points
    .map((t) => ({
      lat: t.sensor!.latitude!,
      lng: t.sensor!.longitude!,
      intensity: (t.value - minVal) / range,
    }));
}
