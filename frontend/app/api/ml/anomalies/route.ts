/**
 * ML Anomalies API - Fetch ML-detected anomalies
 * GET /api/ml/anomalies
 */

import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const hours = parseInt(searchParams.get("hours") || "24");
    const sensorId = searchParams.get("sensorId");
    const onlyAnomalies = searchParams.get("onlyAnomalies") === "true";

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const where: any = {
      detectedAt: { gte: since },
    };

    if (sensorId) {
      where.sensorId = sensorId;
    }

    if (onlyAnomalies) {
      where.isAnomaly = true;
    }

    // Fetch ML anomaly detections
    const anomalies = await prisma.mLAnomalyDetection.findMany({
      where,
      include: {
        sensor: {
          select: {
            id: true,
            sensorCode: true,
            latitude: true,
            longitude: true,
            structure: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        telemetry: {
          select: {
            timestamp: true,
          },
        },
      },
      orderBy: { detectedAt: "desc" },
      take: limit,
    });

    // Calculate statistics
    const stats = {
      total: anomalies.length,
      anomalyCount: anomalies.filter((a) => a.isAnomaly).length,
      avgAnomalyScore: anomalies.length > 0
        ? anomalies.reduce((sum, a) => sum + a.anomalyScore, 0) / anomalies.length
        : 0,
      byReadingType: anomalies.reduce((acc, a) => {
        acc[a.readingType] = (acc[a.readingType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return NextResponse.json({
      anomalies,
      stats,
      timeWindow: { hours, since: since.toISOString() },
    });
  } catch (error: any) {
    console.error("Error fetching ML anomalies:", error);
    return NextResponse.json(
      { error: "Failed to fetch ML anomalies", details: error.message },
      { status: 500 }
    );
  }
}
