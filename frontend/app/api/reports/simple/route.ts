import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
  annotatedImageUrl?: string;
  detectedClass?: string;
}

export async function POST(req: Request) {
  try {
    console.log('[SIMPLE-REPORT] Starting report creation...');

    const body = await req.json();
    console.log('[SIMPLE-REPORT] Request body:', JSON.stringify(body));

    const { title, description, latitude, longitude, imageUrl } = body;

    // Validate
    if (!latitude || !longitude) {
      console.error('[SIMPLE-REPORT] Missing coordinates');
      return NextResponse.json(
        { success: false, error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Parse coordinates
    const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
    const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;

    console.log('[SIMPLE-REPORT] Parsed coordinates:', { lat, lng });

    if (isNaN(lat) || isNaN(lng)) {
      console.error('[SIMPLE-REPORT] Invalid coordinates');
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    // Get user ID from Clerk
    let userId = null;
    try {
      const { auth } = await import('@clerk/nextjs/server');
      const { userId: clerkUserId } = await auth();
      
      if (clerkUserId) {
        const dbUser = await prisma.user.findUnique({
          where: { clerk_user_id: clerkUserId },
        });
        userId = dbUser?.id || null;
        console.log('[SIMPLE-REPORT] Found user:', userId);
      }
    } catch (authError) {
      console.log('[SIMPLE-REPORT] No auth user, creating anonymous report');
    }

    // Call AI detection service if image is provided
    let aiResponse: AIDetectionResponse = { detected: false };
    if (imageUrl) {
      try {
        console.log('[SIMPLE-REPORT] Calling AI detection service...');
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        
        const detectResponse = await fetch(`${aiServiceUrl}/detect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl }),
        });

        if (detectResponse.ok) {
          aiResponse = await detectResponse.json();
          console.log('[SIMPLE-REPORT] AI detection result:', aiResponse.detected, 'confidence:', aiResponse.confidence);
        } else {
          console.warn('[SIMPLE-REPORT] AI service returned error:', detectResponse.status);
        }
      } catch (aiError) {
        console.warn('[SIMPLE-REPORT] AI detection failed, continuing without detection:', aiError);
      }
    }

    console.log('[SIMPLE-REPORT] Creating report in database...');

    // Create report with full pipeline in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create report
      const report = await tx.report.create({
        data: {
          title: title || 'Pothole Report',
          description: description || null,
          latitude: lat,
          longitude: lng,
          imageUrl: imageUrl || null,
          userId: userId,
          status: aiResponse.detected ? 'VERIFIED' : 'PENDING',
        },
      });

      console.log('[SIMPLE-REPORT] Report created:', report.id);

      let media = null;
      let detection = null;
      let pothole = null;

      // Create Media record if image was uploaded
      if (imageUrl) {
        media = await tx.media.create({
          data: {
            mediaUrl: imageUrl,
            mediaType: 'IMAGE',
            reportId: report.id,
          },
        });
        console.log('[SIMPLE-REPORT] Media created:', media.id);

        // If AI detected a pothole, create Detection and Pothole records
        if (aiResponse.detected && aiResponse.confidence && aiResponse.bbox) {
          detection = await tx.detection.create({
            data: {
              mediaId: media.id,
              confidence: aiResponse.confidence,
              detectedClass: aiResponse.detectedClass || 'pothole',
              bboxX: aiResponse.bbox.x,
              bboxY: aiResponse.bbox.y,
              bboxWidth: aiResponse.bbox.width,
              bboxHeight: aiResponse.bbox.height,
            },
          });
          console.log('[SIMPLE-REPORT] Detection created:', detection.id);

          // Create Pothole record linked to detection
          pothole = await tx.pothole.create({
            data: {
              latitude: lat,
              longitude: lng,
              imageUrl: imageUrl,
              detectionId: detection.id,
              priorityScore: aiResponse.confidence * 10, // Simple priority calculation
              priorityLevel: aiResponse.confidence > 0.85 ? 'HIGH' : aiResponse.confidence > 0.7 ? 'MEDIUM' : 'LOW',
            },
          });
          console.log('[SIMPLE-REPORT] Pothole created:', pothole.id);
        }
      }

      return { report, media, detection, pothole };
    });

    console.log('[SIMPLE-REPORT] Transaction completed successfully');

    return NextResponse.json({
      success: true,
      report: result.report,
      media: result.media,
      detection: result.detection,
      pothole: result.pothole,
      aiDetected: aiResponse.detected,
      message: aiResponse.detected 
        ? 'Report created with AI pothole detection' 
        : 'Report created successfully',
    });

  } catch (error: any) {
    console.error('[SIMPLE-REPORT] Error:', error);
    console.error('[SIMPLE-REPORT] Error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create report',
      details: error.toString(),
      stack: error.stack,
    }, { status: 500 });
  }
}

