/**
 * API Route: POST /api/sensors
 * Create new IoT sensors
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Define types locally based on Prisma schema
type SensorType = 'WATER_METER' | 'PRESSURE_SENSOR' | 'ENERGY_METER';

interface CreateSensorRequest {
  sensorCode: string;
  sensorType: SensorType;
  structureId: string;
  topicName: string;
  zone?: string;
  latitude?: number;
  longitude?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateSensorRequest = await request.json();

    // Validate required fields
    if (!body.sensorCode || !body.sensorType || !body.structureId || !body.topicName) {
      return NextResponse.json(
        { error: 'Missing required fields: sensorCode, sensorType, structureId, topicName' },
        { status: 400 }
      );
    }

    // Check if structure exists
    const structure = await prisma.structure.findUnique({
      where: { id: body.structureId }
    });

    if (!structure) {
      return NextResponse.json(
        { error: 'Structure not found' },
        { status: 404 }
      );
    }

    // Check if sensor code already exists
    const existingSensor = await prisma.ioTSensor.findUnique({
      where: { sensorCode: body.sensorCode }
    });

    if (existingSensor) {
      return NextResponse.json(
        { error: 'Sensor code already exists' },
        { status: 409 }
      );
    }

    // Create sensor
    const sensor = await prisma.ioTSensor.create({
      data: {
        sensorCode: body.sensorCode,
        sensorType: body.sensorType,
        structureId: body.structureId,
        topicName: body.topicName,
        zone: body.zone,
        latitude: body.latitude,
        longitude: body.longitude,
        isActive: true,
        isSubscribed: false, // Default to not subscribed
        installedAt: new Date()
      }
    });

    console.log(`✅ Created sensor: ${sensor.sensorCode} (${sensor.sensorType})`);

    return NextResponse.json({
      success: true,
      message: 'Sensor created successfully',
      data: sensor
    });

  } catch (error) {
    console.error('❌ Error creating sensor:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create sensor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/sensors
 * List all sensors with telemetry stats
 */
export async function GET() {
  try {
    const sensors = await prisma.ioTSensor.findMany({
      include: {
        structure: {
          select: {
            name: true,
          }
        },
        _count: {
          select: {
            telemetry: true,
            anomalies: true
          }
        }
      },
      orderBy: {
        installedAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: sensors
    });

  } catch (error) {
    console.error('❌ Error fetching sensors:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sensors'
      },
      { status: 500 }
    );
  }
}