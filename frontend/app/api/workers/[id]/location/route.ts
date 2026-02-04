/**
 * POST /api/workers/[id]/location
 * Update worker's current location and log it
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface LocationUpdateRequest {
  latitude: number;
  longitude: number;
  accuracy?: number; // GPS accuracy in meters
}

export async function POST(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params; // ✅ CRITICAL: Await params
    const body: LocationUpdateRequest = await request.json();

    if (body.latitude == null || body.longitude == null) {
      return NextResponse.json(
        { error: 'Missing required fields: latitude, longitude' },
        { status: 400 }
      );
    }

    // Verify worker exists - try by id first, then by employeeId
    let worker = await prisma.worker.findUnique({
      where: { id },
    });
    
    if (!worker) {
      worker = await prisma.worker.findUnique({
        where: { employeeId: id },
      });
    }

    if (!worker) {
      return NextResponse.json(
        { error: 'Worker not found' },
        { status: 404 }
      );
    }

    // Update worker's current location
    const updatedWorker = await prisma.worker.update({
      where: { id: worker.id },
      data: {
        currentLatitude: body.latitude,
        currentLongitude: body.longitude,
        lastLocationUpdate: new Date(),
      },
    });

    // Log location in history
    await prisma.workerLocation.create({
      data: {
        workerId: worker.id,
        latitude: body.latitude,
        longitude: body.longitude,
        accuracy: body.accuracy,
      },
    });

    return NextResponse.json({
      success: true,
      worker: {
        id: updatedWorker.id,
        name: updatedWorker.name,
        currentLatitude: updatedWorker.currentLatitude,
        currentLongitude: updatedWorker.currentLongitude,
        lastLocationUpdate: updatedWorker.lastLocationUpdate,
      },
      message: 'Location updated successfully',
    });
  } catch (error) {
    console.error('Error updating worker location:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/workers/[id]/location
 * Get worker's current location and recent location history
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;

    const { searchParams } = new URL(request.url);
    const historyLimit = parseInt(searchParams.get('historyLimit') || '10');

    // Fetch worker with recent location history - try by id first, then by employeeId
    let worker = await prisma.worker.findUnique({
      where: { id },
      include: {
        locationLogs: {
          orderBy: { recordedAt: 'desc' },
          take: historyLimit,
        },
      },
    });
    
    if (!worker) {
      worker = await prisma.worker.findUnique({
        where: { employeeId: id },
        include: {
          locationLogs: {
            orderBy: { recordedAt: 'desc' },
            take: historyLimit,
          },
        },
      });
    }

    if (!worker) {
      return NextResponse.json(
        { error: 'Worker not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      currentLocation: {
        latitude: worker.currentLatitude,
        longitude: worker.currentLongitude,
        lastUpdate: worker.lastLocationUpdate,
      },
      locationHistory: worker.locationLogs,
    });
  } catch (error) {
    console.error('Error fetching worker location:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
