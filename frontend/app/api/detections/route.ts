// app/api/detections/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define types for request body
interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DetectionRequest {
  mediaId: string;
  confidence: number;
  bbox: BBox;
  classLabel?: string;
}

// POST: Python AI Service calls this to save results
export async function POST(req: Request) {
  try {
    const body: DetectionRequest = await req.json();
    const { mediaId, confidence, bbox, classLabel } = body;

    // Validate required fields
    if (!mediaId || confidence === undefined || !bbox) {
      return NextResponse.json(
        { error: "Missing required fields: mediaId, confidence, or bbox" },
        { status: 400 },
      );
    }

    // Validate bbox structure
    if (
      typeof bbox.x !== "number" ||
      typeof bbox.y !== "number" ||
      typeof bbox.width !== "number" ||
      typeof bbox.height !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid bbox format" },
        { status: 400 },
      );
    }

    // Verify media exists
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
      select: { reportId: true },
    });

    if (!media) {
      return NextResponse.json(
        { error: `Media with id ${mediaId} not found` },
        { status: 404 },
      );
    }

    // Use transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Detection record
      const detection = await tx.detection.create({
        data: {
          mediaId: mediaId,
          confidence: confidence,
          detectedClass: classLabel || "pothole",
          bboxX: bbox.x,
          bboxY: bbox.y,
          bboxWidth: bbox.width,
          bboxHeight: bbox.height,
        },
      });

      // 2. AUTO-UPDATE: If confidence is high, mark report as VERIFIED
      if (confidence > 0.85 && media.reportId) {
        await tx.report.update({
          where: { id: media.reportId },
          data: {
            status: "VERIFIED",
            severity: 3, // HIGH severity as number
          },
        });
      }

      return detection;
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Save Detection Error:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          { error: "Invalid mediaId reference" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to save detection",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
