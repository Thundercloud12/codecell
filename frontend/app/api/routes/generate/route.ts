/**
 * POST /api/routes/generate
 * Generate route between two coordinates using OSRM
 * Standalone endpoint for route calculation
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateRoute,
  formatDistance,
  formatDuration,
  decodePolyline,
} from '@/lib/services/routing.service';

interface RouteRequest {
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  decodePolyline?: boolean; // Option to decode polyline to coordinates
}

export async function POST(request: NextRequest) {
  try {
    const body: RouteRequest = await request.json();

    // Validate coordinates
    if (
      body.startLat == null ||
      body.startLon == null ||
      body.endLat == null ||
      body.endLon == null
    ) {
      return NextResponse.json(
        {
          error: 'Missing required fields: startLat, startLon, endLat, endLon',
        },
        { status: 400 }
      );
    }

    // Validate coordinate ranges
    if (
      Math.abs(body.startLat) > 90 ||
      Math.abs(body.endLat) > 90 ||
      Math.abs(body.startLon) > 180 ||
      Math.abs(body.endLon) > 180
    ) {
      return NextResponse.json(
        { error: 'Invalid coordinate values' },
        { status: 400 }
      );
    }

    // Generate route
    const route = await generateRoute(
      body.startLat,
      body.startLon,
      body.endLat,
      body.endLon
    );

    // Optionally decode polyline
    let coordinates: [number, number][] | undefined;
    if (body.decodePolyline) {
      coordinates = decodePolyline(route.polyline);
    }

    return NextResponse.json({
      success: true,
      route: {
        distance: route.distance,
        distanceFormatted: formatDistance(route.distance),
        duration: route.duration,
        durationFormatted: formatDuration(route.duration),
        polyline: route.polyline,
        coordinates: coordinates,
        estimatedArrival: route.estimatedArrival,
        startLocation: route.startLocation,
        endLocation: route.endLocation,
      },
    });
  } catch (error) {
    console.error('Error generating route:', error);
    return NextResponse.json(
      { error: 'Failed to generate route', details: String(error) },
      { status: 500 }
    );
  }
}
