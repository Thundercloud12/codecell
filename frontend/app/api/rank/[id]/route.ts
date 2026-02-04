/**
 * POST /api/rank/[id]
 * Calculate severity ranking for a pothole
 * Updates priority score and level based on detection metrics and road context
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import { calculateSeverity, explainSeverity } from '@/lib/services/severity-ranking.service';

const prisma = new PrismaClient();

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params; // ✅ CRITICAL: Await params

    // Fetch pothole with detection and road info
    const pothole = await prisma.pothole.findUnique({
      where: { id },
      include: {
        detection: true,
        roadInfo: true,
      },
    });

    if (!pothole) {
      return NextResponse.json(
        { error: 'Pothole not found' },
        { status: 404 }
      );
    }

    // Require road info for accurate ranking
    if (!pothole.roadInfo) {
      return NextResponse.json(
        {
          error: 'Road info required for ranking. Call POST /api/road-info/:id first',
        },
        { status: 400 }
      );
    }

    // Calculate severity
    const severityResult = calculateSeverity({
      bboxWidth: pothole.detection.bboxWidth,
      bboxHeight: pothole.detection.bboxHeight,
      confidence: pothole.detection.confidence,
      roadPriorityFactor: pothole.roadInfo.priorityFactor,
      trafficImportance: pothole.roadInfo.trafficImportance,
    });

    // Update pothole with ranking
    const updatedPothole = await prisma.pothole.update({
      where: { id },
      data: {
        priorityScore: severityResult.priorityScore,
        priorityLevel: severityResult.priorityLevel,
      },
      include: {
        detection: true,
        roadInfo: true,
      },
    });

    // Generate explanation
    const explanation = explainSeverity(severityResult);

    return NextResponse.json(
      {
        success: true,
        pothole: updatedPothole,
        ranking: {
          score: severityResult.priorityScore,
          level: severityResult.priorityLevel,
          breakdown: severityResult.breakdown,
          explanation,
        },
        message: 'Severity ranking calculated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error calculating severity ranking:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/rank/[id]
 * Get existing ranking for a pothole
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;

    const pothole = await prisma.pothole.findUnique({
      where: { id },
      include: {
        detection: true,
        roadInfo: true,
      },
    });

    if (!pothole) {
      return NextResponse.json(
        { error: 'Pothole not found' },
        { status: 404 }
      );
    }

    if (!pothole.priorityScore || !pothole.priorityLevel) {
      return NextResponse.json(
        { error: 'Pothole has not been ranked yet' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ranking: {
        score: pothole.priorityScore,
        level: pothole.priorityLevel,
      },
      pothole,
    });
  } catch (error) {
    console.error('Error fetching ranking:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
