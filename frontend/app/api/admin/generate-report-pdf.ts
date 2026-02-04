import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface ReportStats {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  averageResolutionTime: number;
}

interface ChartData {
  dailyReports: Array<{ date: string; count: number }>;
  statusDistribution: Array<{ status: string; count: number }>;
  severityDistribution: Array<{ severity: string; count: number }>;
}

/**
 * GET /api/admin/generate-report-pdf
 * Generate monthly report data for PDF generation
 * Query params:
 * - month: Required, format YYYY-MM (e.g., 2025-02)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get('month');

    if (!monthParam || !monthParam.match(/^\d{4}-\d{2}$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid month format. Use YYYY-MM' },
        { status: 400 },
      );
    }

    const [yearStr, monthStr] = monthParam.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    // Validate month
    if (month < 1 || month > 12) {
      return NextResponse.json(
        { success: false, error: 'Invalid month. Must be 1-12' },
        { status: 400 },
      );
    }

    // Get first and last day of month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    // Fetch all reports for the month
    const reports = await prisma.report.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        media: {
          include: {
            detections: {
              include: {
                pothole: {
                  select: {
                    severity: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate statistics
    const stats: ReportStats = {
      totalReports: reports.length,
      resolvedReports: reports.filter((r) => r.status === 'RESOLVED').length,
      pendingReports: reports.filter((r) => r.status === 'PENDING').length,
      averageResolutionTime: 0,
    };

    // Calculate average resolution time for resolved reports
    const resolvedReports = reports.filter((r) => r.status === 'RESOLVED');
    if (resolvedReports.length > 0) {
      const totalHours = resolvedReports.reduce((acc, report) => {
        const createdTime = new Date(report.createdAt).getTime();
        const resolvedTime = new Date(report.updatedAt || report.createdAt).getTime();
        return acc + (resolvedTime - createdTime) / (1000 * 60 * 60); // Convert to hours
      }, 0);
      stats.averageResolutionTime = Math.round((totalHours / resolvedReports.length / 24) * 10) / 10; // Convert to days
    }

    // Get top 20 locations
    const topLocations = reports
      .slice(0, 20)
      .map((report) => {
        const maxSeverity = Math.max(
          ...(report.media
            .flatMap((m) =>
              m.detections
                .flatMap((d) => d.pothole?.severity || 0)
                .filter((s) => s !== undefined),
            )
            .filter((s) => s !== undefined) || [0]),
        );

        return {
          id: report.id,
          latitude: report.latitude,
          longitude: report.longitude,
          status: report.status,
          severity: maxSeverity || null,
          createdAt: report.createdAt,
          title: report.title || 'Unnamed Report',
        };
      });

    // Generate daily reports chart data
    const dailyReports: { [key: string]: number } = {};
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dailyReports[dateStr] = 0;
    }

    reports.forEach((report) => {
      const dateStr = new Date(report.createdAt)
        .toISOString()
        .slice(0, 10);
      if (dailyReports.hasOwnProperty(dateStr)) {
        dailyReports[dateStr]++;
      }
    });

    // Status distribution
    const statusDistribution = [
      {
        status: 'PENDING',
        count: reports.filter((r) => r.status === 'PENDING').length,
      },
      {
        status: 'VERIFIED',
        count: reports.filter((r) => r.status === 'VERIFIED').length,
      },
      {
        status: 'RESOLVED',
        count: reports.filter((r) => r.status === 'RESOLVED').length,
      },
    ].filter((s) => s.count > 0);

    // Severity distribution (from detections)
    const severityMap: { [key: number]: number } = {};
    reports.forEach((report) => {
      report.media.forEach((media) => {
        media.detections.forEach((detection) => {
          const severity = detection.pothole?.severity || 0;
          severityMap[severity] = (severityMap[severity] || 0) + 1;
        });
      });
    });

    const severityDistribution = Object.entries(severityMap)
      .map(([severity, count]) => ({
        severity: `Level ${severity}`,
        count,
      }))
      .sort((a, b) => parseInt(a.severity.split(' ')[1]) - parseInt(b.severity.split(' ')[1]));

    const chartData: ChartData = {
      dailyReports: Object.entries(dailyReports).map(([date, count]) => ({
        date,
        count,
      })),
      statusDistribution,
      severityDistribution,
    };

    return NextResponse.json({
      success: true,
      month: monthParam,
      year,
      generatedDate: new Date().toISOString(),
      stats,
      topLocations,
      chartData,
    });
  } catch (error) {
    console.error('Report Generation Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 },
    );
  }
}
