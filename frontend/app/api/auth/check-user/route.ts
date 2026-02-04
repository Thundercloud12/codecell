/**
 * GET /api/auth/check-user
 * Check if current Clerk user exists in database and return their info
 */

import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get Clerk user
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        {
          success: false,
          exists: false,
          error: "Not authenticated",
        },
        { status: 401 },
      );
    }

    // Find user in database by Clerk ID
    const dbUser = await prisma.user.findUnique({
      where: { clerk_user_id: clerkUserId },
      select: {
        id: true,
        clerk_user_id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        {
          success: false,
          exists: false,
          message:
            "User not found in database. Please complete role selection.",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        exists: true,
        user: dbUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      {
        success: false,
        exists: false,
        error: "Internal server error",
        details: String(error),
      },
      { status: 500 },
    );
  }
}
