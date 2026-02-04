/**
 * POST /api/potholes
 * Create pothole record from detection data
 * Entry point for detected potholes to enter the repair workflow
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface PotholeCreateRequest {
  detectionId: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PotholeCreateRequest = await request.json();

    // Validate required fields
    if (!body.detectionId || body.latitude == null || body.longitude == null) {
      return NextResponse.json(
        { error: "Missing required fields: detectionId, latitude, longitude" },
        { status: 400 },
      );
    }

    // Validate detection exists
    const detection = await prisma.detection.findUnique({
      where: { id: body.detectionId },
    });

    if (!detection) {
      return NextResponse.json(
        { error: "Detection not found" },
        { status: 404 },
      );
    }

    // Check if pothole already exists for this detection
    const existingPothole = await prisma.pothole.findUnique({
      where: { detectionId: body.detectionId },
    });

    if (existingPothole) {
      return NextResponse.json(
        {
          error: "Pothole already exists for this detection",
          pothole: existingPothole,
        },
        { status: 409 },
      );
    }

    // Create pothole
    const pothole = await prisma.pothole.create({
      data: {
        detectionId: body.detectionId,
        latitude: body.latitude,
        longitude: body.longitude,
        imageUrl: body.imageUrl,
      },
      include: {
        detection: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        pothole,
        message: "Pothole created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating pothole:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}

/**
 * GET /api/potholes
 * List potholes with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const priorityLevel = searchParams.get("priorityLevel");
    const hasTicket = searchParams.get("hasTicket");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build filter
    const where: any = {};

    if (priorityLevel) {
      where.priorityLevel = priorityLevel;
    }

    if (hasTicket === "true") {
      where.ticket = { isNot: null };
    } else if (hasTicket === "false") {
      where.ticket = null;
    }

    // Query with pagination
    const [potholes, total] = await Promise.all([
      prisma.pothole.findMany({
        where,
        include: {
          detection: {
            include: {
              media: true, // Include the annotated image
            },
          },
          roadInfo: true,
          ticket: {
            include: {
              assignedWorker: true,
            },
          },
        },
        orderBy: [{ priorityScore: "desc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
      }),
      prisma.pothole.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      potholes,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching potholes:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
