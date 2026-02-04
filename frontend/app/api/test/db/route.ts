import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();

    // Count users
    const userCount = await prisma.user.count();
    const workerCount = await prisma.worker.count();

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { worker: true },
    });

    return NextResponse.json({
      success: true,
      connected: true,
      stats: {
        totalUsers: userCount,
        totalWorkers: workerCount,
      },
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        hasWorkerProfile: !!u.worker,
        createdAt: u.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("[DB-TEST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        connected: false,
        error: error.message,
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
