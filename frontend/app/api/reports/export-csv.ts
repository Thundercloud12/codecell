import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/reports/export-csv
 * Export reports as CSV file with optional filters
 * Query params:
 * - status: PENDING, VERIFIED, RESOLVED (default: ALL)
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    interface WhereClause {
      status?: string;
      createdAt?: {
        gte?: Date;
        lt?: Date;
      };
    }
    const where: WhereClause = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Add one day to include the entire end date
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        where.createdAt.lt = endDateObj;
      }
    }

    // Fetch reports
    const reports = await prisma.report.findMany({
      where,
      include: {
        user: {
          select: {
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
        createdAt: 'desc',
      },
    });

    // Function to escape CSV fields
    function escapeCSVField(field: string | number | null | undefined): string {
      if (field === null || field === undefined) return '';
      const str = String(field);
      // Escape quotes and wrap field in quotes if it contains comma, quotes, or newlines
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }

    // Build CSV content
    const headers = [
      'ID',
      'Title',
      'Status',
      'Location (Lat,Lon)',
      'Created Date',
      'User Email',
      'Severity',
    ];

    const rows = reports.map((report) => {
      const maxSeverity = report.media.length > 0 ? 3 : 0;
      const latitude = report.latitude || 0;
      const longitude = report.longitude || 0;
      
      return [
        escapeCSVField(report.id),
        escapeCSVField(report.title || 'N/A'),
        escapeCSVField(report.status),
        escapeCSVField(
          `${latitude.toFixed(4)},${longitude.toFixed(4)}`,
        ),
        escapeCSVField(new Date(report.createdAt).toLocaleString()),
        escapeCSVField(report.user?.email || 'N/A'),
        escapeCSVField(maxSeverity || 'N/A'),
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    // Return as CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="reports-export-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error('CSV Export Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export CSV' },
      { status: 500 },
    );
  }
}
