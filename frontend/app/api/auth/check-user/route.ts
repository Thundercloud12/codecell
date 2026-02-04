import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { clerk_user_id: userId },
      include: {
        worker: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        exists: false,
        message: "User not found in database. Please complete role selection.",
      });
    }

    return NextResponse.json({
      success: true,
      exists: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasWorkerProfile: !!user.worker,
      },
    });
  } catch (error: any) {
    console.error("[CHECK-USER] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
