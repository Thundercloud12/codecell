import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { existsSync } from "fs";
import { fetchRoadInfo } from "@/lib/osm";

export async function POST(req: Request) {
  try {
    // Validate content type
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const reportId = formData.get("reportId") as string;

    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    if (!reportId)
      return NextResponse.json(
        { error: "reportId is required" },
        { status: 400 },
      );

    // File validation
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "video/mp4"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and MP4 allowed" },
        { status: 400 },
      );
    }

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Ensure uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true });

    // Save file
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/${filename}`;
    const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${fileUrl}`;

    // Ensure report exists
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report)
      return NextResponse.json({ error: "Report not found" }, { status: 404 });

    // -------------------------------
    // STEP 1 — Create media record
    // -------------------------------
    const media = await prisma.media.create({
      data: {
        reportId,
        mediaUrl: fileUrl,
        mediaType: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
      },
    });

    // -------------------------------
    // STEP 2 — Run AI Detection (NO TRANSACTION)
    // -------------------------------
    let aiData: any = null;

    if (file.type.startsWith("image")) {
      try {
        const aiServiceUrl =
          process.env.AI_SERVICE_URL || "http://localhost:8000";

        const detectResponse = await fetch(`${aiServiceUrl}/detect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: fullUrl }),
        });

        if (detectResponse.ok) {
          aiData = await detectResponse.json();
        }
      } catch (err) {
        console.error("AI detection error:", err);
      }
    }

    // -------------------------------
    // STEP 3 — DB Writes in Transaction (FAST)
    // -------------------------------
    let detection = null;
    let pothole = null;
    let annotatedMedia = null;

    if (aiData?.detected && aiData.confidence && aiData.bbox) {
      await prisma.$transaction(async (tx) => {
        detection = await tx.detection.create({
          data: {
            mediaId: media.id,
            confidence: aiData.confidence,
            detectedClass: aiData.detectedClass || "pothole",
            bboxX: aiData.bbox.x,
            bboxY: aiData.bbox.y,
            bboxWidth: aiData.bbox.width,
            bboxHeight: aiData.bbox.height,
          },
        });

        // Create annotated media record if AI returned annotated image
        if (aiData.annotatedImageUrl) {
          annotatedMedia = await tx.media.create({
            data: {
              reportId,
              mediaUrl: aiData.annotatedImageUrl,
              mediaType: "IMAGE",
            },
          });
        }

        let priorityLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
        if (aiData.confidence > 0.9) priorityLevel = "CRITICAL";
        else if (aiData.confidence > 0.85) priorityLevel = "HIGH";
        else if (aiData.confidence > 0.7) priorityLevel = "MEDIUM";

        pothole = await tx.pothole.create({
          data: {
            latitude: report.latitude,
            longitude: report.longitude,
            imageUrl: fileUrl,
            detectionId: detection.id,
            priorityScore: aiData.confidence * 10,
            priorityLevel,
          },
        });

        await tx.report.update({
          where: { id: reportId },
          data: { status: "VERIFIED" },
        });
      });
    }

    // -------------------------------
    // STEP 4 — Fetch Road Info from OSM (OUTSIDE TRANSACTION)
    // -------------------------------
    let roadInfo = null;

    if (pothole) {
      try {
        console.log("[OSM] Fetching road info for pothole:", pothole.id);
        
        roadInfo = await fetchRoadInfo(report.latitude, report.longitude);

        if (roadInfo) {
          // Calculate traffic importance and priority factor
          const trafficImportance =
            roadInfo.roadType === "motorway" ? 5 :
            roadInfo.roadType === "trunk" ? 4 :
            roadInfo.roadType === "primary" ? 3 :
            roadInfo.roadType === "secondary" ? 2 :
            1;

          const priorityFactor =
            roadInfo.roadType === "motorway" ? 2.5 :
            roadInfo.roadType === "trunk" ? 2.0 :
            roadInfo.roadType === "primary" ? 1.5 :
            roadInfo.roadType === "secondary" ? 1.2 :
            1.0;

          await prisma.roadInfo.create({
            data: {
              potholeId: pothole.id,
              roadName: roadInfo.roadName,
              roadType: roadInfo.roadType,
              speedLimit: roadInfo.speedLimit,
              osmData: roadInfo.osmData,
              trafficImportance,
              priorityFactor,
            },
          });

          console.log("[OSM] Road info saved:", roadInfo.roadName || roadInfo.roadType);
        } else {
          console.log("[OSM] No road data found nearby");
        }
      } catch (err) {
        console.error("[OSM] Failed to fetch road info:", err);
        // Don't fail the upload if OSM fails
      }
    }

    // -------------------------------
    // RESPONSE
    // -------------------------------
    return NextResponse.json({
      success: true,
      data: media,
      url: fileUrl,
      detection,
      pothole,
      annotatedMedia,
      roadInfo,
      message: pothole
        ? "File uploaded and pothole detected!"
        : "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
