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
  potholeId?: string; // Single pothole (legacy)
  potholeIds?: string[]; // Multiple potholes (new)
  notes?: string;
}

/**
 * Create new ticket from pothole(s)
 */
export async function POST(request: NextRequest) {
  try {
    const body: TicketCreateRequest = await request.json();

    // Support both single and multiple potholes
    const potholeIds = body.potholeIds || (body.potholeId ? [body.potholeId] : []);

    if (!potholeIds || potholeIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing required field: potholeId or potholeIds' },
        { status: 400 }
      );
    }

    // Verify all potholes exist and have been ranked
    const potholes = await prisma.pothole.findMany({
      where: { id: { in: potholeIds } },
      include: { ticket: true },
    });

    if (potholes.length !== potholeIds.length) {
      return NextResponse.json(
        { error: 'One or more potholes not found' },
        { status: 404 }
      );
    }

    // Check if all potholes are ranked
    const unrankedPotholes = potholes.filter(p => !p.priorityScore || !p.priorityLevel);
    if (unrankedPotholes.length > 0) {
      return NextResponse.json(
        { error: 'All potholes must be ranked before creating ticket' },
        { status: 400 }
      );
    }

    // Check if any pothole already has a ticket
    const existingTickets = potholes.filter(p => p.ticket);
    if (existingTickets.length > 0) {
      return NextResponse.json(
        { error: 'One or more potholes already have tickets', tickets: existingTickets.map(p => p.ticket) },
        { status: 409 }
      );
    }

    // Generate ticket number (simple format: TICKET-YYYYMMDD-XXXXX)
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    const ticketNumber = `TICKET-${date}-${random}`;

    // Create ticket with DETECTED status and link all potholes
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        status: 'DETECTED',
        notes: body.notes,
        potholes: {
          connect: potholeIds.map(id => ({ id })),
        },
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
        reason: `Ticket created from ${potholeIds.length} pothole${potholeIds.length > 1 ? 's' : ''}`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        ticket,
        potholeCount: potholeIds.length,
        message: `Ticket created successfully with ${potholeIds.length} pothole${potholeIds.length > 1 ? 's' : ''}`,
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
