/**
 * POST /api/tickets
 * Create a ticket from a ranked pothole
 * 
 * PATCH /api/tickets (not used - see [id]/status and [id]/assign)
 * GET /api/tickets - List all tickets with filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

interface TicketCreateRequest {
  potholeId: string;
  notes?: string;
}

/**
 * Create new ticket from pothole
 */
export async function POST(request: NextRequest) {
  try {
    const body: TicketCreateRequest = await request.json();

    if (!body.potholeId) {
      return NextResponse.json(
        { error: 'Missing required field: potholeId' },
        { status: 400 }
      );
    }

    // Verify pothole exists and has been ranked
    const pothole = await prisma.pothole.findUnique({
      where: { id: body.potholeId },
      include: { ticket: true },
    });

    if (!pothole) {
      return NextResponse.json(
        { error: 'Pothole not found' },
        { status: 404 }
      );
    }

    if (!pothole.priorityScore || !pothole.priorityLevel) {
      return NextResponse.json(
        { error: 'Pothole must be ranked before creating ticket' },
        { status: 400 }
      );
    }

    if (pothole.ticket) {
      return NextResponse.json(
        { error: 'Ticket already exists for this pothole', ticket: pothole.ticket },
        { status: 409 }
      );
    }

    // Generate ticket number (simple format: TICKET-YYYYMMDD-XXXXX)
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    const ticketNumber = `TICKET-${date}-${random}`;

    // Create ticket with DETECTED status
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        potholeId: body.potholeId,
        status: 'DETECTED',
        notes: body.notes,
      },
      include: {
        potholes: {
          include: {
            detection: true,
            roadInfo: true,
          },
        },
      },
    });

    // Create status history entry
    await prisma.ticketStatusHistory.create({
      data: {
        ticketId: ticket.id,
        toStatus: 'DETECTED',
        reason: 'Ticket created from detected pothole',
      },
    });

    return NextResponse.json(
      {
        success: true,
        ticket,
        message: 'Ticket created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * List tickets with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const priorityLevel = searchParams.get('priorityLevel');
    const workerId = searchParams.get('workerId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build filter
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (priorityLevel) {
      where.pothole = {
        priorityLevel: priorityLevel,
      };
    }

    if (workerId) {
      where.assignedWorkerId = workerId;
    }

    // Query with pagination
    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
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
            take: 1, // Latest proof only
          },
        },
        orderBy: [
          { createdAt: 'desc' },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.ticket.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      tickets,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
