import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

// Types for AI detection response
interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AIDetectionResponse {
  detected: boolean;
  confidence?: number;
  bbox?: BBox;
  annotatedImageUrl?: string; // URL of the image with bounding box drawn
  detectedClass?: string;
}

// GET: Fetch all reports (For Admin Dashboard or User's own reports)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");

    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const reports = await prisma.report.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        media: {
          include: {
            detections: {
              include: {
                pothole: {
                  select: {
                    id: true,
                    priorityLevel: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      reports: reports,
      data: reports,
      count: reports.length,
    });
  } catch (error) {
    console.error("Fetch Reports Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reports" },
      { status: 500 },
    );
  }
}

// POST: Create a new report with AI detection pipeline
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Handle JSON request (from citizen form)
    if (contentType.includes("application/json")) {
      try {
        const body = await req.json();
        const { title, description, latitude, longitude, imageUrl, userId } =
          body;

        console.log('[REPORT-CREATE] Received data:', { title, latitude, longitude, hasImage: !!imageUrl });

        if (!latitude || !longitude) {
          return NextResponse.json(
            { success: false, error: "Latitude and longitude are required" },
            { status: 400 },
          );
        }

        // Get user from Clerk if not provided
        let reportUserId = userId;
        if (!reportUserId) {
          try {
            const { auth } = await import("@clerk/nextjs/server");
            const { userId: clerkUserId } = await auth();
            console.log('[REPORT-CREATE] Clerk user ID:', clerkUserId);
            
            if (clerkUserId) {
              const user = await prisma.user.findUnique({
                where: { clerk_user_id: clerkUserId },
              });
              console.log('[REPORT-CREATE] Found database user:', user?.id);
              reportUserId = user?.id;
            }
          } catch (authError) {
            console.error('[REPORT-CREATE] Auth error:', authError);
            // Continue without user ID - allow anonymous reports
          }
        }

        console.log('[REPORT-CREATE] Creating report for userId:', reportUserId);

        const report = await prisma.report.create({
          data: {
            title: title || "Pothole Report",
            description: description || null,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            imageUrl: imageUrl || null,
            userId: reportUserId || null,
            status: "PENDING",
          },
        });

        console.log('[REPORT-CREATE] Report created successfully:', report.id);

        return NextResponse.json({
          success: true,
          report: report,
          message: "Report created successfully",
        });
      } catch (jsonError: any) {
        console.error('[REPORT-CREATE] JSON request error:', jsonError);
        return NextResponse.json({
          success: false,
          error: jsonError.message || "Failed to create report",
          details: jsonError.toString(),
        }, { status: 500 });
      }
    }

    // Handle multipart form data (from admin/advanced forms with AI detection)
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);
    const userId = formData.get("userId") as string;

    // Validate required fields
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 },
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only images (JPEG, PNG, WEBP) are allowed",
        },
        { status: 400 },
      );
    }

    // Step 1: Upload original file to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let originalImageUrl: string;

    try {
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "pothole-reports",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        uploadStream.end(buffer);
      });

      originalImageUrl = uploadResult.secure_url;
    } catch (cloudinaryError) {
      console.error("Cloudinary upload failed:", cloudinaryError);
      return NextResponse.json(
        { error: "Failed to upload image to cloud storage" },
        { status: 500 },
      );
    }

    // Step 2: Call Python AI service for pothole detection
    let aiResponse: AIDetectionResponse;

    try {
      const aiServiceUrl =
        process.env.AI_SERVICE_URL || "http://localhost:8000";
      const detectResponse = await fetch(`${aiServiceUrl}/detect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: originalImageUrl,
        }),
      });

      if (!detectResponse.ok) {
        throw new Error(`AI service returned ${detectResponse.status}`);
      }

      aiResponse = await detectResponse.json();
    } catch (aiError) {
      console.error("AI detection service failed:", aiError);
      // Continue without AI detection (graceful degradation)
      aiResponse = { detected: false };
    }

    // Step 3: Conditional Prisma insertion with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the Report
      const report = await tx.report.create({
        data: {
          title: title || "Pothole Report",
          description: description || null,
          latitude,
          longitude,
          userId: userId || null,
          status: aiResponse.detected ? "VERIFIED" : "PENDING",
          severity:
            aiResponse.detected &&
            aiResponse.confidence &&
            aiResponse.confidence > 0.85
              ? 3
              : 1,
        },
      });

      // Scenario A: Pothole Detected - Create two Media records
      if (aiResponse.detected && aiResponse.annotatedImageUrl) {
        // Original Media
        const originalMedia = await tx.media.create({
          data: {
            mediaUrl: originalImageUrl,
            mediaType: "IMAGE",
            reportId: report.id,
          },
        });

        // Detected/Annotated Media
        const detectedMedia = await tx.media.create({
          data: {
            mediaUrl: aiResponse.annotatedImageUrl,
            mediaType: "IMAGE",
            reportId: report.id,
          },
        });

        // Create Detection record linked to detected media
        let detection = null;
        if (aiResponse.bbox && aiResponse.confidence) {
          detection = await tx.detection.create({
            data: {
              mediaId: detectedMedia.id,
              confidence: aiResponse.confidence,
              detectedClass: aiResponse.detectedClass || "pothole",
              bboxX: aiResponse.bbox.x,
              bboxY: aiResponse.bbox.y,
              bboxWidth: aiResponse.bbox.width,
              bboxHeight: aiResponse.bbox.height,
            },
          });
          
          // Automatically create pothole if confidence is high enough (>= 70%)
          if (aiResponse.confidence >= 0.7) {
            try {
              await tx.pothole.create({
                data: {
                  detectionId: detection.id,
                  latitude: report.latitude,
                  longitude: report.longitude,
                  imageUrl: originalImageUrl,
                  // Set priority based on confidence
                  priorityScore: aiResponse.confidence * 10, // 0.7 confidence = 7.0 priority score
                  priorityLevel: aiResponse.confidence >= 0.9 ? "HIGH" : 
                                aiResponse.confidence >= 0.8 ? "MEDIUM" : "LOW",
                },
              });
              console.log(`🕳️ Pothole auto-created for detection ${detection.id} with confidence ${aiResponse.confidence}`);
            } catch (potholeError) {
              console.warn("Failed to auto-create pothole:", potholeError);
              // Continue without failing the whole transaction
            }
          }
        }

        return {
          report,
          media: [originalMedia, detectedMedia],
          detected: true,
        };
      } else {
        // Scenario B: No Pothole - Create only one Media record
        const originalMedia = await tx.media.create({
          data: {
            mediaUrl: originalImageUrl,
            mediaType: "IMAGE",
            reportId: report.id,
          },
        });

        return {
          report,
          media: [originalMedia],
          detected: false,
        };
      }
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: result.detected
        ? "Report created with AI detection"
        : "Report created without detection",
    });
  } catch (error: any) {
    console.error("Report Creation Error (FormData):", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create report",
        details: error.message || error.toString(),
      },
      { status: 500 },
    );
  }
}
