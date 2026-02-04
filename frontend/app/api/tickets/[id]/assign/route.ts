/**
 * POST /api/tickets/[id]/assign
 * Assign a ticket to a worker
 * Updates status from RANKED -> ASSIGNED
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import { validateTransition } from '@/lib/services/ticket-lifecycle.service';

const prisma = new PrismaClient();

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface AssignRequest {
  workerId: string;
  notes?: string;
}

export async function POST(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params; // ✅ CRITICAL: Await params
    const body: AssignRequest = await request.json();

    if (!body.workerId) {
      return NextResponse.json(
        { error: 'Missing required field: workerId' },
        { status: 400 }
      );
    }

    // Verify worker exists and is active
    const worker = await prisma.worker.findUnique({
      where: { id: body.workerId },
    });

    if (!worker) {
      return NextResponse.json(
        { error: 'Worker not found' },
        { status: 404 }
      );
    }

    if (!worker.isActive) {
      return NextResponse.json(
        { error: 'Worker is not active' },
        { status: 400 }
      );
    }

    // Fetch ticket
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        pothole: {
          include: {
            roadInfo: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Validate status transition to ASSIGNED
    const validation = validateTransition(ticket.status as any, 'ASSIGNED');
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.reason },
        { status: 400 }
      );
    }

    // Update ticket
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        assignedWorkerId: body.workerId,
        status: 'ASSIGNED',
        assignedAt: new Date(),
        notes: body.notes || ticket.notes,
      },
      include: {
        pothole: {
          include: {
            detection: true,
            roadInfo: true,
          },
        },
        assignedWorker: true,
      },
    });

    // Log status change
    await prisma.ticketStatusHistory.create({
      data: {
        ticketId: ticket.id,
        fromStatus: ticket.status as any,
        toStatus: 'ASSIGNED',
        changedBy: body.workerId,
        reason: `Assigned to worker ${worker.name}`,
      },
    });

    return NextResponse.json({
      success: true,
      ticket: updatedTicket,
      message: `Ticket assigned to ${worker.name}`,
    });
  } catch (error) {
    console.error('Error assigning ticket:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tickets/[id]/assign
 * Get assignment details for a ticket
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        assignedWorker: true,
        pothole: {
          include: {
            roadInfo: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    if (!ticket.assignedWorker) {
      return NextResponse.json(
        { error: 'Ticket is not assigned to any worker' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      assignment: {
        ticket: {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          status: ticket.status,
          assignedAt: ticket.assignedAt,
        },
        worker: ticket.assignedWorker,
        pothole: ticket.pothole,
      },
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
