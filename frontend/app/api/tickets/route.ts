/**
 * POST /api/tickets
 * Create a ticket from a ranked pothole or multiple potholes on the same route
 *
 * PATCH /api/tickets (not used - see [id]/status and [id]/assign)
 * GET /api/tickets - List all tickets with filtering
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface TicketCreateRequest {
  potholeId?: string; // For backward compatibility - single pothole
  potholeIds?: string[]; // For multiple potholes on same route
  notes?: string;
}

/**
 * Create new ticket from pothole(s)
 */
export async function POST(request: NextRequest) {
  try {
    const body: TicketCreateRequest = await request.json();

    // Handle both single and multiple pothole IDs
    let potholeIds: string[] = [];
    if (body.potholeIds && Array.isArray(body.potholeIds)) {
      potholeIds = body.potholeIds;
    } else if (body.potholeId) {
      potholeIds = [body.potholeId];
    }

    if (potholeIds.length === 0) {
      return NextResponse.json(
        { error: "Missing required field: potholeId or potholeIds" },
        { status: 400 },
      );
    }

    // Verify all potholes exist and have been ranked
    const potholes = await prisma.pothole.findMany({
      where: { id: { in: potholeIds } },
      select: {
        id: true,
        priorityScore: true,
        priorityLevel: true,
        ticketId: true,
        ticket: {
          select: {
            id: true,
            ticketNumber: true,
            status: true,
          },
        },
      },
    });

    if (potholes.length === 0) {
      return NextResponse.json({ error: "No potholes found" }, { status: 404 });
    }

    if (potholes.length !== potholeIds.length) {
      return NextResponse.json(
        { error: "Some potholes not found" },
        { status: 404 },
      );
    }

    // Check if any pothole doesn't have ranking
    const unrankedPotholes = potholes.filter(
      (p) => !p.priorityScore || !p.priorityLevel,
    );
    if (unrankedPotholes.length > 0) {
      return NextResponse.json(
        {
          error: "All potholes must be ranked before creating ticket",
          unrankedPotholeIds: unrankedPotholes.map((p) => p.id),
        },
        { status: 400 },
      );
    }

    // Check if any pothole already has a ticket (ticketId is not null)
    const potholesWithTickets = potholes.filter((p) => p.ticketId !== null);
    if (potholesWithTickets.length > 0) {
      return NextResponse.json(
        {
          error: "Some potholes already have tickets",
          conflictingTickets: potholesWithTickets.map((p) => ({
            potholeId: p.id,
            ticket: p.ticket,
          })),
        },
        { status: 409 },
      );
    }

    // Generate ticket number (simple format: TICKET-YYYYMMDD-XXXXX)
    const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const random = Math.floor(Math.random() * 99999)
      .toString()
      .padStart(5, "0");
    const ticketNumber = `TICKET-${date}-${random}`;

    console.log("Creating ticket with potholeIds:", potholeIds);

    // Create ticket with DETECTED status
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        status: "DETECTED",
        notes: body.notes,
        potholes: {
          connect: potholeIds.map((id) => ({ id })),
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

    console.log(
      "Ticket created successfully:",
      JSON.stringify(ticket, null, 2),
    );

    // Create status history entry
    await prisma.ticketStatusHistory.create({
      data: {
        ticketId: ticket.id,
        toStatus: "DETECTED",
        reason: `Ticket created from ${potholeIds.length} detected pothole(s)`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        ticket,
        potholeCount: potholeIds.length,
        message: `Ticket created successfully with ${potholeIds.length} pothole(s)`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}

/**
 * List tickets with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const priorityLevel = searchParams.get("priorityLevel");
    const workerId = searchParams.get("workerId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build filter
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (priorityLevel) {
      where.potholes = {
        some: {
          priorityLevel: priorityLevel,
        },
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
            orderBy: { submittedAt: "desc" },
            take: 1, // Latest proof only
          },
        },
        orderBy: [{ createdAt: "desc" }],
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
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
