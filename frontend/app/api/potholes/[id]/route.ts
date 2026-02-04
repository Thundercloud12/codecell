/**
 * GET /api/potholes/[id]
 * Get a single pothole by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pothole = await prisma.pothole.findUnique({
      where: { id },
      include: {
        detection: {
          include: {
            media: true,
          },
        },
        roadInfo: true,
        ticket: {
          include: {
            assignedWorker: true,
          },
        },
      },
    });

    if (!pothole) {
      return NextResponse.json(
        { success: false, error: 'Pothole not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pothole,
    });
  } catch (error) {
    console.error('Error fetching pothole:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}