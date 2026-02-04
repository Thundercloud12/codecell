/**
 * POST /api/workers
 * Create a new worker
 * 
 * GET /api/workers
 * List all workers
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";


interface WorkerCreateRequest {
  name: string;
  email: string;
  phone?: string;
  employeeId: string;
}

/**
 * Create new worker
 */
export async function POST(request: NextRequest) {
  try {
    const body: WorkerCreateRequest = await request.json();

    if (!body.name || !body.email || !body.employeeId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, employeeId' },
        { status: 400 }
      );
    }

    // Check for duplicate email or employeeId
    const existing = await prisma.worker.findFirst({
      where: {
        OR: [
          { email: body.email },
          { employeeId: body.employeeId },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Worker with this email or employee ID already exists' },
        { status: 409 }
      );
    }

    const worker = await prisma.worker.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        employeeId: body.employeeId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        worker,
        message: 'Worker created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating worker:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * List all workers
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const isActive = searchParams.get('isActive');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const [workers, total] = await Promise.all([
      prisma.worker.findMany({
        where,
        include: {
          assignedTickets: {
            where: {
              status: {
                in: ['ASSIGNED', 'IN_PROGRESS'],
              },
            },
            include: {
              potholes: {
                select: {
                  latitude: true,
                  longitude: true,
                  priorityLevel: true,
                },
              },
            },
          },
          _count: {
            select: {
              assignedTickets: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.worker.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      workers,
      pagination: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching workers:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
