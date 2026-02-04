// app/api/reports/user/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const userReports = await prisma.report.findMany({
      where: {
        userId: userId,
      },
      include: {
        media: true, // Show the photo they uploaded
        detections: true, // Show if AI found anything (optional)
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(userReports);
  } catch (error) {
    console.error("Fetch User Reports Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user history" },
      { status: 500 },
    );
  }
}
