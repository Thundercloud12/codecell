import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all reports (for map view - no userId filter)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status) where.status = status;

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
            detections: true,
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
      count: reports.length,
    });
  } catch (error) {
    console.error("Fetch All Reports Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reports" },
      { status: 500 },
    );
  }
}
