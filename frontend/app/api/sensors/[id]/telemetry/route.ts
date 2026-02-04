/**
 * API Route: GET /api/sensors/[id]/telemetry
 * Fetch telemetry data for a sensor
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const since = searchParams.get('since'); // ISO date string
    const readingType = searchParams.get('readingType');

    // Find sensor
    const sensor = await prisma.ioTSensor.findUnique({
      where: { id },
      include: {
        structure: {
          select: {
            name: true,
            type: true,
            location: true
          }
        }
      }
    });

    if (!sensor) {
      return NextResponse.json(
        { error: 'Sensor not found' },
        { status: 404 }
      );
    }

    // Build telemetry query
    const whereClause: any = {
      sensorId: id
    };

    if (since) {
      whereClause.timestamp = {
        gte: new Date(since)
      };
    }

    if (readingType) {
      whereClause.readingType = readingType;
    }

    // Fetch telemetry data
    const [telemetryData, totalCount] = await Promise.all([
      prisma.sensorTelemetry.findMany({
        where: whereClause,
        orderBy: {
          timestamp: 'desc'
        },
        take: Math.min(limit, 1000), // Cap at 1000 records
        skip: offset,
        select: {
          id: true,
          timestamp: true,
          readingType: true,
          value: true,
          unit: true,
          createdAt: true
        }
      }),
      prisma.sensorTelemetry.count({
        where: whereClause
      })
    ]);

    // Get basic statistics
    const stats = await prisma.sensorTelemetry.aggregate({
      where: whereClause,
      _avg: { value: true },
      _min: { value: true },
      _max: { value: true },
      _count: { id: true }
    });

    // Get recent anomalies
    const recentAnomalies = await prisma.utilityAnomaly.findMany({
      where: {
        sensorId: id,
        detectedAt: since ? { gte: new Date(since) } : undefined
      },
      orderBy: {
        detectedAt: 'desc'
      },
      take: 10,
      select: {
        id: true,
        anomalyType: true,
        severity: true,
        detectedValue: true,
        expectedRange: true,
        detectedAt: true,
        isResolved: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        sensor: {
          id: sensor.id,
          sensorCode: sensor.sensorCode,
          sensorType: sensor.sensorType,
          topicName: sensor.topicName,
          isSubscribed: sensor.isSubscribed,
          isActive: sensor.isActive,
          lastHeartbeat: sensor.lastHeartbeat,
          structure: sensor.structure
        },
        telemetry: {
          records: telemetryData,
          pagination: {
            total: totalCount,
            limit,
            offset,
            hasMore: offset + telemetryData.length < totalCount
          },
          statistics: {
            average: stats._avg.value,
            minimum: stats._min.value,
            maximum: stats._max.value,
            count: stats._count.id
          }
        },
        anomalies: recentAnomalies
      }
    });

  } catch (error) {
    console.error('❌ Error fetching telemetry:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch telemetry data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}