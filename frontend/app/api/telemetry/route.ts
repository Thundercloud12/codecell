import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sensorId = searchParams.get("sensorId");
    const readingType = searchParams.get("readingType");
    const limit = parseInt(searchParams.get("limit") || "100");
    const hours = parseInt(searchParams.get("hours") || "1"); // Default last 1 hour

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    // Build where clause
    const where: any = {
      timestamp: { gte: since },
    };

    if (sensorId) {
      where.sensorId = sensorId;
    }

    if (readingType) {
      where.readingType = readingType;
    }

    // Fetch telemetry data
    const telemetry = await prisma.sensorTelemetry.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit,
      include: {
        sensor: {
          select: {
            sensorCode: true,
            sensorType: true,
            structure: {
              select: {
                id: true,
                name: true,
                structureType: true,
              },
            },
          },
        },
      },
    });

    // Get all sensors with their latest reading
    const sensors = await prisma.ioTSensor.findMany({
      where: { isActive: true },
      include: {
        structure: {
          select: {
            id: true,
            name: true,
            structureType: true,
          },
        },
        telemetry: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
    });

    // Get recent anomalies
    const anomalies = await prisma.utilityAnomaly.findMany({
      where: {
        detectedAt: { gte: since },
      },
      orderBy: { detectedAt: "desc" },
      take: 20,
      include: {
        sensor: {
          select: {
            sensorCode: true,
            sensorType: true,
          },
        },
      },
    });

    // Aggregate stats
    const stats = {
      totalReadings: telemetry.length,
      activeSensors: sensors.filter((s) => s.isActive).length,
      totalAnomalies: anomalies.length,
      criticalAnomalies: anomalies.filter((a) => a.severity === "CRITICAL").length,
    };

    return NextResponse.json({
      telemetry: telemetry.reverse(), // Oldest first for charts
      sensors,
      anomalies,
      stats,
    });
  } catch (error) {
    console.error("Error fetching telemetry:", error);
    return NextResponse.json(
      { error: "Failed to fetch telemetry data" },
      { status: 500 }
    );
  }
}
