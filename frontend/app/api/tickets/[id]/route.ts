/**
 * GET /api/tickets/[id]
 * Get a single ticket by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

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

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        potholes: {
          include: {
            detection: true,
            roadInfo: true,
          },
        },
        assignedWorker: {
          select: {
            id: true,
            name: true,
            email: true,
            employeeId: true,
          },
        },
        workProofs: {
          orderBy: { submittedAt: 'desc' },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
