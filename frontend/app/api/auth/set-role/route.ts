import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { role } = await req.json();

    // Validate role
    const validRoles = ["ADMIN", "CITIZEN", "WORKER"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role" },
        { status: 400 },
      );
    }

    console.log(`[SET-ROLE] Setting role ${role} for user ${userId}`);

    // Update Clerk user metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role,
      },
    });

    console.log(`[SET-ROLE] Updated Clerk metadata for ${userId}`);

    // Get user email from Clerk
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "No email found" },
        { status: 400 },
      );
    }

    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      email.split("@")[0];

    console.log(`[SET-ROLE] Creating/updating database user for ${email}`);

    // Create or update user in database
    const user = await prisma.user.upsert({
      where: { clerk_user_id: userId },
      update: {
        role: role as any,
        name: name,
      },
      create: {
        clerk_user_id: userId,
        email: email,
        name: name,
        role: role as any,
      },
    });

    console.log(`[SET-ROLE] Database user created/updated: ${user.id}`);

    // If role is WORKER, create worker profile
    if (role === "WORKER") {
      const existingWorker = await prisma.worker.findUnique({
        where: { userId: user.id },
      });

      if (!existingWorker) {
        const workerEmployeeId = `EMP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        const worker = await prisma.worker.create({
          data: {
            userId: user.id,
            name: user.name || "Worker",
            email: user.email,
            employeeId: workerEmployeeId,
            isActive: true,
          },
        });

        console.log(
          `[SET-ROLE] Worker profile created: ${worker.id} with ID ${workerEmployeeId}`,
        );
      } else {
        console.log(
          `[SET-ROLE] Worker profile already exists for user ${user.id}`,
        );
      }
    }

    return NextResponse.json({
      success: true,
      role: role,
      userId: user.id,
    });
  } catch (error: any) {
    console.error("[SET-ROLE] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
