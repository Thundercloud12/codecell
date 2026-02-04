/**
 * API Route: POST /api/sensors/[id]/subscribe
 * Enable Kafka ingestion for a sensor
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    // Find sensor
    const sensor = await prisma.ioTSensor.findUnique({
      where: { id },
      include: {
        structure: {
          select: {
            name: true,
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

    // Update subscription status
    const updatedSensor = await prisma.ioTSensor.update({
      where: { id },
      data: { 
        isSubscribed: true,
        isActive: true // Also ensure sensor is active
      }
    });

    console.log(`📡 SUBSCRIBED: ${sensor.sensorCode} for ${sensor.structure.name}`);

    return NextResponse.json({
      success: true,
      message: `Sensor ${sensor.sensorCode} is now subscribed to Kafka ingestion`,
      data: {
        sensorCode: updatedSensor.sensorCode,
        structureName: sensor.structure.name,
        topicName: updatedSensor.topicName,
        isSubscribed: updatedSensor.isSubscribed,
        isActive: updatedSensor.isActive
      }
    });

  } catch (error) {
    console.error('❌ Error subscribing sensor:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to subscribe sensor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}