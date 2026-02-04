/**
 * PATCH /api/tickets/[id]/status
 * Update ticket status with lifecycle validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import {
  validateTransitionWithContext,
  type TicketStatus,
} from '@/lib/services/ticket-lifecycle.service';

const prisma = new PrismaClient();

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface StatusUpdateRequest {
  status: TicketStatus;
  reason?: string;
  changedBy?: string; // User/Worker ID who made the change
}

export async function PATCH(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params; // ✅ CRITICAL: Await params
    const body: StatusUpdateRequest = await request.json();

    if (!body.status) {
      return NextResponse.json(
        { error: 'Missing required field: status' },
        { status: 400 }
      );
    }

    // Fetch current ticket
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        workProofs: true,
        assignedWorker: true,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Validate transition
    const validation = validateTransitionWithContext(
      ticket.status as TicketStatus,
      body.status,
      {
        hasAssignedWorker: !!ticket.assignedWorkerId,
        hasProofUploaded: ticket.workProofs.length > 0,
      }
    );

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.reason },
        { status: 400 }
      );
    }

    // Update ticket status
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        status: body.status,
        // Update timestamps based on status
        ...(body.status === 'IN_PROGRESS' && !ticket.startedAt && {
          startedAt: new Date(),
        }),
        ...(body.status === 'AWAITING_VERIFICATION' && !ticket.completedAt && {
          completedAt: new Date(),
        }),
        ...(body.status === 'RESOLVED' && !ticket.resolvedAt && {
          resolvedAt: new Date(),
        }),
      },
      include: {
        pothole: {
          include: {
            detection: true,
            roadInfo: true,
          },
        },
        assignedWorker: true,
        workProofs: true,
      },
    });

    // Log status change in history
    await prisma.ticketStatusHistory.create({
      data: {
        ticketId: ticket.id,
        fromStatus: ticket.status as TicketStatus,
        toStatus: body.status,
        changedBy: body.changedBy,
        reason: body.reason,
      },
    });

    return NextResponse.json({
      success: true,
      ticket: updatedTicket,
      message: `Ticket status updated to ${body.status}`,
    });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tickets/[id]/status
 * Get status history for a ticket
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;

    const history = await prisma.ticketStatusHistory.findMany({
      where: { ticketId: id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error('Error fetching status history:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
