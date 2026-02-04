/**
 * POST /api/tickets/[id]/proof
 * Worker uploads completion proof for a ticket
 * - Upload images showing repair completion
 * - Submit notes about the work done
 * - Updates ticket status to AWAITING_VERIFICATION
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateTransition } from "@/lib/services/ticket-lifecycle.service";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface ProofUploadRequest {
  imageUrls: string[]; // URLs of uploaded images (upload handled separately by Cloudinary/S3)
  notes?: string;
  latitude?: number; // Location where proof was taken
  longitude?: number;
}

export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params; // ✅ CRITICAL: Await params
    const body: ProofUploadRequest = await request.json();

    // Validate required fields
    if (!body.imageUrls || body.imageUrls.length === 0) {
      return NextResponse.json(
        { error: "At least one image URL is required" },
        { status: 400 },
      );
    }

    // Fetch ticket
    const ticket = await prisma.ticket.findUnique({
      where: { id: id },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Verify ticket is in progress
    if (ticket.status !== "IN_PROGRESS") {
      return NextResponse.json(
        {
          error: `Cannot upload proof. Ticket must be IN_PROGRESS. Current status: ${ticket.status}`,
        },
        { status: 400 },
      );
    }

    // Create work proof record
    const workProof = await prisma.workProof.create({
      data: {
        ticketId: id,
        imageUrls: body.imageUrls,
        notes: body.notes,
        latitude: body.latitude,
        longitude: body.longitude,
      },
    });

    // Validate transition to AWAITING_VERIFICATION
    const validation = validateTransition(
      ticket.status as any,
      "AWAITING_VERIFICATION",
    );

    if (!validation.isValid) {
      return NextResponse.json({ error: validation.reason }, { status: 400 });
    }

    // Update ticket status
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        status: "AWAITING_VERIFICATION",
        completedAt: new Date(),
      },
      include: {
        potholes: {
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
        ticketId: id,
        fromStatus: ticket.status as any,
        toStatus: "AWAITING_VERIFICATION",
        changedBy: ticket.assignedWorkerId || undefined,
        reason: "Work proof uploaded by worker",
      },
    });

    return NextResponse.json({
      success: true,
      ticket: updatedTicket,
      workProof,
      message:
        "Proof uploaded successfully. Ticket awaiting admin verification.",
    });
  } catch (error) {
    console.error("Error uploading proof:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}

/**
 * GET /api/tickets/[id]/proof
 * Get all proof submissions for a ticket
 */
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;

    const proofs = await prisma.workProof.findMany({
      where: { ticketId: id },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      proofs,
    });
  } catch (error) {
    console.error("Error fetching proofs:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}