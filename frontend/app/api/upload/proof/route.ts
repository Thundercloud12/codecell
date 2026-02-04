/**
 * File upload endpoint specifically for work proof images using Cloudinary
 * POST /api/upload/proof
 */

import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

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
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // File validation
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG and PNG images are allowed for work proof" },
        { status: 400 },
      );
    }

    // Size validation (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 },
      );
    }

    // Convert file to base64 for Cloudinary upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Generate unique public_id for Cloudinary
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^/.]+$/, '');
    const publicId = `work-proof/${type || 'proof'}_${timestamp}_${sanitizedName}`;

    // Upload to Cloudinary
    console.log('📤 Uploading to Cloudinary...');
    const uploadResult = await cloudinary.uploader.upload(base64Data, {
      public_id: publicId,
      folder: "pothole-system/work-proofs",
      resource_type: "image",
      transformation: [
        { quality: "auto" },
        { fetch_format: "auto" }
      ],
      tags: ["work-proof", type || "proof"]
    });

    console.log(`✅ Uploaded proof to Cloudinary: ${uploadResult.public_id}`);

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully to Cloudinary",
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      cloudinaryUrl: uploadResult.secure_url,
      filename: file.name,
      size: file.size,
      type: file.type,
      width: uploadResult.width,
      height: uploadResult.height,
    });

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file to Cloudinary", details: String(error) },
      { status: 500 },
    );
  }
}