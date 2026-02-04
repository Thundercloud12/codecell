/**
 * API Route: POST /api/structures
 * Create new infrastructure structures
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Define types locally based on Prisma schema
type StructureType = 'ROAD' | 'BRIDGE' | 'PIPELINE' | 'SUBSTATION' | 'BUILDING';

interface CreateStructureRequest {
  name: string;
  type: StructureType;
  location: string;
  zone?: string;
  latitude?: number;
  longitude?: number;
  expectedLifespanYears?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateStructureRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.type || !body.location) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, location' },
        { status: 400 }
      );
    }

    // Create structure
    const structure = await prisma.structure.create({
      data: {
        name: body.name,
        structureType: body.type,
        zone: body.zone,
        latitude: body.latitude,
        longitude: body.longitude,
        expectedLifespanYears: body.expectedLifespanYears || 25,
        conditionScore: 85.0, // Default good condition
        riskScore: 15.0, // Default low risk
        installedAt: new Date()
      }
    });

    console.log(`✅ Created structure: ${structure.name} (${structure.type})`);

    return NextResponse.json({
      success: true,
      message: 'Structure created successfully',
      data: structure
    });

  } catch (error) {
    console.error('❌ Error creating structure:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create structure',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/structures
 * List all structures with sensor counts
 */
export async function GET() {
  try {
    const structures = await prisma.structure.findMany({
      include: {
        sensors: {
          select: {
            id: true,
            sensorCode: true,
            sensorType: true,
            isActive: true,
            isSubscribed: true,
            lastHeartbeat: true
          }
        },
        _count: {
          select: {
            sensors: true,
            maintenanceLogs: true,
            failureEvents: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: structures
    });

  } catch (error) {
    console.error('❌ Error fetching structures:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch structures'
      },
      { status: 500 }
    );
  }
}