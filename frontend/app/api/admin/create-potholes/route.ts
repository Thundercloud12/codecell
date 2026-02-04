import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

/**
 * POST /api/admin/create-potholes
 * Bulk create potholes from high-confidence detections that don't have potholes yet
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { minConfidence = 0.7 } = body;

    // Find all high-confidence detections without potholes
    const detectionsWithoutPotholes = await prisma.detection.findMany({
      where: {
        confidence: {
          gte: minConfidence,
        },
        pothole: null, // No pothole created yet
      },
      include: {
        media: {
          include: {
            report: true,
          },
        },
      },
    });

    console.log(`Found ${detectionsWithoutPotholes.length} high-confidence detections without potholes`);

    const createdPotholes = [];
    let errors = [];

    for (const detection of detectionsWithoutPotholes) {
      try {
        const report = detection.media.report;
        if (!report) {
          errors.push(`Detection ${detection.id} has no associated report`);
          continue;
        }

        const pothole = await prisma.pothole.create({
          data: {
            detectionId: detection.id,
            latitude: report.latitude,
            longitude: report.longitude,
            imageUrl: detection.media.mediaUrl,
            priorityScore: detection.confidence * 10,
            priorityLevel: detection.confidence >= 0.9 ? "HIGH" : 
                          detection.confidence >= 0.8 ? "MEDIUM" : "LOW",
          },
        });

        createdPotholes.push(pothole);
        console.log(`✅ Created pothole ${pothole.id} from detection ${detection.id} (confidence: ${detection.confidence})`);
      } catch (error) {
        errors.push(`Failed to create pothole for detection ${detection.id}: ${error}`);
        console.error(`❌ Failed to create pothole for detection ${detection.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdPotholes.length} potholes from ${detectionsWithoutPotholes.length} detections`,
      created: createdPotholes.length,
      total_detections: detectionsWithoutPotholes.length,
      errors: errors,
      potholes: createdPotholes,
    });

  } catch (error) {
    console.error('Error in bulk pothole creation:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/create-potholes
 * Get stats about detections that could be converted to potholes
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const minConfidence = parseFloat(searchParams.get('minConfidence') || '0.7');

    const [detections, existingPotholes, detectionsWithoutPotholes] = await Promise.all([
      prisma.detection.count({
        where: { confidence: { gte: minConfidence } }
      }),
      prisma.pothole.count(),
      prisma.detection.count({
        where: {
          confidence: { gte: minConfidence },
          pothole: null,
        }
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        total_high_confidence_detections: detections,
        existing_potholes: existingPotholes,
        detections_without_potholes: detectionsWithoutPotholes,
        can_create: detectionsWithoutPotholes,
        min_confidence: minConfidence,
      },
    });

  } catch (error) {
    console.error('Error getting pothole creation stats:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}