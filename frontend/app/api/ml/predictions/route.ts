/**
 * ML Predictions API - Fetch LSTM failure predictions
 * GET /api/ml/predictions
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
    const structureId = searchParams.get("structureId");
    const onlyValid = searchParams.get("onlyValid") === "true"; // Only predictions still valid
    const onlyHighRisk = searchParams.get("onlyHighRisk") === "true"; // Only HIGH/CRITICAL risk

    const where: any = {};

    if (structureId) {
      where.structureId = structureId;
    }

    if (onlyValid) {
      where.validUntil = { gte: new Date() };
    }

    if (onlyHighRisk) {
      where.failureRisk = { in: ["HIGH", "CRITICAL"] };
    }

    // Fetch ML failure predictions
    const predictions = await prisma.mLFailurePrediction.findMany({
      where,
      include: {
        structure: {
          select: {
            id: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      orderBy: { predictedAt: "desc" },
      take: 100,
    });

    // Get latest prediction per structure
    const latestByStructure = predictions.reduce((acc, pred) => {
      if (!acc[pred.structureId] || pred.predictedAt > acc[pred.structureId].predictedAt) {
        acc[pred.structureId] = pred;
      }
      return acc;
    }, {} as Record<string, typeof predictions[0]>);

    const latestPredictions = Object.values(latestByStructure);

    // Calculate statistics
    const stats = {
      total: predictions.length,
      latestCount: latestPredictions.length,
      highRiskCount: latestPredictions.filter((p) => p.failureRisk === "HIGH" || p.failureRisk === "CRITICAL").length,
      failure24hCount: latestPredictions.filter((p) => p.predictedFailure24h).length,
      avgFailureProbability: latestPredictions.length > 0
        ? latestPredictions.reduce((sum, p) => sum + p.failureProbability, 0) / latestPredictions.length
        : 0,
      byRisk: latestPredictions.reduce((acc, p) => {
        acc[p.failureRisk] = (acc[p.failureRisk] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return NextResponse.json({
      predictions,
      latestPredictions,
      stats,
    });
  } catch (error: any) {
    console.error("Error fetching ML predictions:", error);
    return NextResponse.json(
      { error: "Failed to fetch ML predictions", details: error.message },
      { status: 500 }
    );
  }
}
