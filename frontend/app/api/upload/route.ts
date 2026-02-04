import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Check content-type header
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

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!reportId) {
      return NextResponse.json(
        { error: "reportId is required" },
        { status: 400 },
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "video/mp4"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and MP4 are allowed" },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Save to database
    const media = await prisma.media.create({
      data: {
        reportId: reportId,
        mediaUrl: `/uploads/${filename}`,
        mediaType: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
      },
    });

    return NextResponse.json({
      success: true,
      data: media,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
