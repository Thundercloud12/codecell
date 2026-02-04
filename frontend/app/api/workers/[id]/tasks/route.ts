/**
 * GET /api/workers/[id]/tasks
 * Get all tasks (tickets) assigned to a worker
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params; // ✅ CRITICAL: Await params
    console.log(id);
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const includeCompleted = searchParams.get('includeCompleted') === 'true';

    // Verify worker exists
    const worker = await prisma.worker.findUnique({
      where: { employeeId:id },
    });
    console.log(worker);
    

    if (!worker) {
      return NextResponse.json(
        { error: 'Worker not found' },
        { status: 404 }
      );
    }

    // Build filter
    const where: any = {
      assignedWorkerId: id,
    };

    if (status) {
      where.status = status;
    } else if (!includeCompleted) {
      // By default, exclude completed/resolved tickets
      where.status = {
        notIn: ['RESOLVED', 'REJECTED'],
      };
    }

    // Fetch tasks
    const tasks = await prisma.ticket.findMany({
      where,
      include: {
        pothole: {
          include: {
            detection: true,
            roadInfo: true,
          },
        },
        workProofs: {
          orderBy: { submittedAt: 'desc' },
        },
      },
      orderBy: [
        { pothole: { priorityScore: 'desc' } },
        { assignedAt: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      worker: {
        id: worker.id,
        name: worker.name,
        email: worker.email,
        employeeId: worker.employeeId,
      },
      tasks,
      summary: {
        total: tasks.length,
        byStatus: tasks.reduce((acc: any, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error('Error fetching worker tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
