/**
 * GET /api/potholes/[id]/nearby
 * Find nearby potholes on the same road/route
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;

    // Get the reference pothole
    const pothole = await prisma.pothole.findUnique({
      where: { id },
      include: {
        roadInfo: true,
        ticket: true,
      },
    });

    if (!pothole) {
      return NextResponse.json(
        { error: 'Pothole not found' },
        { status: 404 }
      );
    }

    // Search radius in degrees (approx 500m)
    const searchRadius = 0.005;

    // Find nearby potholes that:
    // 1. Are within 500m radius
    // 2. Don't have a ticket yet
    // 3. Have been ranked
    // 4. Preferably on the same road
    const nearbyPotholes = await prisma.pothole.findMany({
      where: {
        AND: [
          { id: { not: id } }, // Exclude current pothole
          { ticket: null }, // No ticket created yet
          { priorityScore: { not: null } }, // Has been ranked
          {
            latitude: {
              gte: pothole.latitude - searchRadius,
              lte: pothole.latitude + searchRadius,
            },
          },
          {
            longitude: {
              gte: pothole.longitude - searchRadius,
              lte: pothole.longitude + searchRadius,
            },
          },
        ],
      },
      include: {
        detection: true,
        roadInfo: true,
      },
      orderBy: {
        priorityScore: 'desc',
      },
      take: 10, // Limit to 10 nearby potholes
    });

    // Calculate distance for each pothole
    const potholesWithDistance = nearbyPotholes.map((p) => {
      const distance = calculateDistance(
        pothole.latitude,
        pothole.longitude,
        p.latitude,
        p.longitude
      );
      return {
        ...p,
        distance,
      };
    });

    // Sort by distance
    potholesWithDistance.sort((a, b) => a.distance - b.distance);

    return NextResponse.json(
      {
        success: true,
        potholes: potholesWithDistance,
        count: potholesWithDistance.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching nearby potholes:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
