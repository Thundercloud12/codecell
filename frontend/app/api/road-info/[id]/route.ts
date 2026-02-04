/**
 * POST /api/road-info/[id]
 * Fetch and store road context for a pothole using Overpass API
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { fetchRoadInfo } from '@/lib/services/road-info.service';

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
    const { id } = await context.params; // ✅ CRITICAL: Await params in Next.js App Router

    // Find pothole
    const pothole = await prisma.pothole.findUnique({
      where: { id },
      include: { roadInfo: true },
    });

    if (!pothole) {
      return NextResponse.json(
        { error: 'Pothole not found' },
        { status: 404 }
      );
    }

    // Check if road info already exists
    if (pothole.roadInfo) {
      return NextResponse.json(
        {
          success: true,
          roadInfo: pothole.roadInfo,
          message: 'Road info already exists',
        },
        { status: 200 }
      );
    }

    // Fetch road info from Overpass API
    console.log(`Fetching road info for pothole ${id} at ${pothole.latitude}, ${pothole.longitude}`);
    
    const roadMetadata = await fetchRoadInfo(
      pothole.latitude,
      pothole.longitude
    );

    // Store in database
    const roadInfo = await prisma.roadInfo.create({
      data: {
        potholeId: pothole.id,
        roadName: roadMetadata.roadName,
        roadType: roadMetadata.roadType,
        speedLimit: roadMetadata.speedLimit,
        trafficImportance: roadMetadata.trafficImportance,
        priorityFactor: roadMetadata.priorityFactor,
        osmData: roadMetadata.osmData as any, // Store raw OSM data as JSON
      },
    });

    return NextResponse.json(
      {
        success: true,
        roadInfo,
        message: 'Road info fetched and stored successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error fetching road info:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/road-info/[id]
 * Get existing road info for a pothole
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;

    const roadInfo = await prisma.roadInfo.findUnique({
      where: { potholeId: id },
      include: {
        pothole: true,
      },
    });

    if (!roadInfo) {
      return NextResponse.json(
        { error: 'Road info not found for this pothole' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      roadInfo,
    });
  } catch (error) {
    console.error('Error fetching road info:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
