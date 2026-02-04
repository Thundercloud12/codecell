/**
 * POST /api/admin/review/[ticketId]
 * Admin reviews and approves/rejects completed work
 * - APPROVE: Marks ticket as RESOLVED
 * - REJECT: Marks ticket as REJECTED (can be reassigned)
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import { validateTransition } from '@/lib/services/ticket-lifecycle.service';

const prisma = new PrismaClient();

interface RouteParams {
  params: Promise<{
    ticketId: string;
  }>;
}

interface ReviewRequest {
  action: 'APPROVE' | 'REJECT';
  reviewedBy: string; // Admin user ID
  reviewNotes?: string;
  proofId?: string; // Specific proof being reviewed (if multiple)
}

export async function POST(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { ticketId } = await context.params; // ✅ CRITICAL: Await params
    const body: ReviewRequest = await request.json();

    // Validate required fields
    if (!body.action || !body.reviewedBy) {
      return NextResponse.json(
        { error: 'Missing required fields: action, reviewedBy' },
        { status: 400 }
      );
    }

    if (body.action !== 'APPROVE' && body.action !== 'REJECT') {
      return NextResponse.json(
        { error: 'Action must be either APPROVE or REJECT' },
        { status: 400 }
      );
    }

    // Fetch ticket with proofs
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        pothole: {
          include: {
            detection: true,
            roadInfo: true,
          },
        },
        assignedWorker: true,
        workProofs: {
          orderBy: { submittedAt: 'desc' },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Verify ticket is awaiting verification
    if (ticket.status !== 'AWAITING_VERIFICATION') {
      return NextResponse.json(
        {
          error: `Cannot review ticket. Must be AWAITING_VERIFICATION. Current status: ${ticket.status}`,
        },
        { status: 400 }
      );
    }

    // Verify proof exists
    if (ticket.workProofs.length === 0) {
      return NextResponse.json(
        { error: 'No proof submitted for this ticket' },
        { status: 400 }
      );
    }

    // Determine target status based on action
    const targetStatus = body.action === 'APPROVE' ? 'RESOLVED' : 'REJECTED';

    // Validate transition
    const validation = validateTransition(ticket.status as any, targetStatus);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.reason },
        { status: 400 }
      );
    }

    // Get the proof to review (latest if not specified)
    const proofToReview = body.proofId
      ? ticket.workProofs.find(p => p.id === body.proofId)
      : ticket.workProofs[0];

    if (!proofToReview) {
      return NextResponse.json(
        { error: 'Specified proof not found' },
        { status: 404 }
      );
    }

    // Update proof with review decision
    await prisma.workProof.update({
      where: { id: proofToReview.id },
      data: {
        isApproved: body.action === 'APPROVE',
        reviewedBy: body.reviewedBy,
        reviewedAt: new Date(),
        reviewNotes: body.reviewNotes,
      },
    });

    // Update ticket status
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: targetStatus,
        adminNotes: body.reviewNotes,
        ...(body.action === 'APPROVE' && {
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

    // Log status change
    await prisma.ticketStatusHistory.create({
      data: {
        ticketId,
        fromStatus: ticket.status as any,
        toStatus: targetStatus,
        changedBy: body.reviewedBy,
        reason: `Admin ${body.action.toLowerCase()}d the work: ${body.reviewNotes || 'No notes'}`,
      },
    });

    return NextResponse.json({
      success: true,
      ticket: updatedTicket,
      decision: body.action,
      message:
        body.action === 'APPROVE'
          ? 'Work approved. Ticket resolved successfully.'
          : 'Work rejected. Ticket can be reassigned.',
    });
  } catch (error) {
    console.error('Error reviewing ticket:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/review/[ticketId]
 * Get ticket details for admin review
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { ticketId } = await context.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        pothole: {
          include: {
            detection: true,
            roadInfo: true,
          },
        },
        assignedWorker: true,
        workProofs: {
          orderBy: { submittedAt: 'desc' },
        },
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ticket,
      awaitingReview: ticket.status === 'AWAITING_VERIFICATION',
    });
  } catch (error) {
    console.error('Error fetching ticket for review:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
