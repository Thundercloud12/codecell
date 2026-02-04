/**
 * POST /api/tickets/create-batch
 * Create tickets for multiple potholes with optional worker assignment
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface BatchTicketRequest {
  potholeIds: string[];
  assignedWorkerId?: string | null;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BatchTicketRequest = await request.json();

    if (!body.potholeIds || body.potholeIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one pothole ID is required' },
        { status: 400 }
      );
    }

    // Verify all potholes exist and are ranked
    const potholes = await prisma.pothole.findMany({
      where: {
        id: { in: body.potholeIds },
      },
      include: {
        ticket: true,
      },
    });

    if (potholes.length !== body.potholeIds.length) {
      return NextResponse.json(
        { error: 'One or more potholes not found' },
        { status: 404 }
      );
    }

    // Check if any pothole already has a ticket
    const existingTickets = potholes.filter((p) => p.ticket);
    if (existingTickets.length > 0) {
      return NextResponse.json(
        {
          error: `${existingTickets.length} pothole(s) already have tickets`,
          existingTicketIds: existingTickets.map((p) => p.ticket!.id),
        },
        { status: 409 }
      );
    }

    // Check if any pothole hasn't been ranked
    const unrankedPotholes = potholes.filter(
      (p) => !p.priorityScore || !p.priorityLevel
    );
    if (unrankedPotholes.length > 0) {
      return NextResponse.json(
        {
          error: `${unrankedPotholes.length} pothole(s) must be ranked first`,
          unrankedIds: unrankedPotholes.map((p) => p.id),
        },
        { status: 400 }
      );
    }

    // Verify worker exists if provided
    if (body.assignedWorkerId) {
      const worker = await prisma.worker.findUnique({
        where: { id: body.assignedWorkerId },
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
    }

    // Create tickets for all potholes
    const tickets = [];
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');

    for (const pothole of potholes) {
      const random = Math.floor(Math.random() * 99999)
        .toString()
        .padStart(5, '0');
      const ticketNumber = `TICKET-${date}-${random}`;

      const ticket = await prisma.ticket.create({
        data: {
          ticketNumber,
          potholeId: pothole.id,
          status: body.assignedWorkerId ? 'ASSIGNED' : 'DETECTED',
          assignedWorkerId: body.assignedWorkerId,
          assignedAt: body.assignedWorkerId ? new Date() : null,
          notes: body.notes,
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

      // Create status history
      await prisma.ticketStatusHistory.create({
        data: {
          ticketId: ticket.id,
          toStatus: body.assignedWorkerId ? 'ASSIGNED' : 'DETECTED',
          reason: body.assignedWorkerId
            ? `Ticket created and assigned to worker`
            : 'Ticket created from detected pothole',
        },
      });

      tickets.push(ticket);
    }

    return NextResponse.json(
      {
        success: true,
        tickets,
        count: tickets.length,
        message: `${tickets.length} ticket(s) created successfully${
          body.assignedWorkerId ? ' and assigned to worker' : ''
        }`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating batch tickets:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
