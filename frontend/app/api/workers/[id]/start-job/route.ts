/**
 * POST /api/workers/[id]/start-job
 * Worker starts a repair job
 * - Generates route to pothole location using OSRM
 * - Updates ticket status to IN_PROGRESS
 * - Stores route data and ETA
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateRoute } from "@/lib/services/routing.service";
import { validateTransition } from "@/lib/services/ticket-lifecycle.service";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface StartJobRequest {
  ticketId: string;
}

export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    const body: StartJobRequest = await request.json();

    if (!body.ticketId) {
      return NextResponse.json(
        { error: "Missing required field: ticketId" },
        { status: 400 },
      );
    }

    // Verify worker exists and has location
    let worker = await prisma.worker.findUnique({
      where: { id },
    });

    if (!worker) {
      worker = await prisma.worker.findUnique({
        where: { employeeId: id },
      });
    }

    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    if (!worker.currentLatitude || !worker.currentLongitude) {
      return NextResponse.json(
        { error: "Worker location not available. Update location first." },
        { status: 400 },
      );
    }

    // Fetch ticket with potholes array
    const ticket = await prisma.ticket.findUnique({
      where: { id: body.ticketId },
      include: {
        potholes: {
          include: {
            detection: true,
            roadInfo: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (!ticket.potholes || ticket.potholes.length === 0) {
      return NextResponse.json(
        { error: "No potholes associated with this ticket" },
        { status: 400 },
      );
    }

    // Verify ticket is assigned to this worker
    if (ticket.assignedWorkerId !== worker.id) {
      return NextResponse.json(
        { error: "Ticket is not assigned to this worker" },
        { status: 403 },
      );
    }

    // Validate status transition
    const validation = validateTransition(ticket.status as any, "IN_PROGRESS");
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.reason }, { status: 400 });
    }

    // Use first pothole as primary destination
    const primaryPothole = ticket.potholes[0];

    // Generate route using OSRM
    console.log(
      `Generating route from worker location (${worker.currentLatitude}, ${worker.currentLongitude}) to pothole (${primaryPothole.latitude}, ${primaryPothole.longitude})`,
    );

    const routeData = await generateRoute(
      worker.currentLatitude,
      worker.currentLongitude,
      primaryPothole.latitude,
      primaryPothole.longitude,
    );

    // Update ticket with route data and status
    const updatedTicket = await prisma.ticket.update({
      where: { id: body.ticketId },
      data: {
        status: "IN_PROGRESS",
        startedAt: new Date(),
        routeData: routeData as any,
        estimatedETA: routeData.estimatedArrival,
      },
      include: {
        potholes: {
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
        toStatus: "IN_PROGRESS",
        changedBy: id,
        reason: "Worker started repair job",
      },
    });

    return NextResponse.json({
      success: true,
      ticket: updatedTicket,
      route: {
        distance: routeData.distance,
        duration: routeData.duration,
        polyline: routeData.polyline,
        estimatedArrival: routeData.estimatedArrival,
      },
      potholeCount: ticket.potholes.length,
      message: "Job started successfully",
    });
  } catch (error) {
    console.error("Error starting job:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
