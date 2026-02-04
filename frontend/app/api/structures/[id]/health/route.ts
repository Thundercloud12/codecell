/**
 * API Route: GET /api/structures/[id]/health
 * Get aggregated sensor health summary for a structure
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const hoursBack = parseInt(searchParams.get('hours') || '24');
    const sinceDate = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    // Find structure
    const structure = await prisma.structure.findUnique({
      where: { id },
      include: {
        sensors: {
          select: {
            id: true,
            sensorCode: true,
            sensorType: true,
            isActive: true,
            isSubscribed: true,
            lastHeartbeat: true,
            topicName: true
          }
        }
      }
    });

    if (!structure) {
      return NextResponse.json(
        { error: 'Structure not found' },
        { status: 404 }
      );
    }

    // Get sensor health metrics
    const sensorHealthPromises = structure.sensors.map(async (sensor) => {
      // Get recent telemetry count
      const telemetryCount = await prisma.sensorTelemetry.count({
        where: {
          sensorId: sensor.id,
          timestamp: { gte: sinceDate }
        }
      });

      // Get recent anomalies
      const anomalies = await prisma.utilityAnomaly.findMany({
        where: {
          sensorId: sensor.id,
          detectedAt: { gte: sinceDate }
        },
        select: {
          severity: true,
          anomalyType: true,
          isResolved: true
        }
      });

      // Calculate health score
      const isOnline = sensor.lastHeartbeat && 
        (Date.now() - new Date(sensor.lastHeartbeat).getTime()) < 10 * 60 * 1000; // 10 minutes

      const criticalAnomalies = anomalies.filter(a => a.severity === 'CRITICAL' && !a.isResolved).length;
      const highAnomalies = anomalies.filter(a => a.severity === 'HIGH' && !a.isResolved).length;
      const totalUnresolvedAnomalies = anomalies.filter(a => !a.isResolved).length;

      // Health score calculation (0-100)
      let healthScore = 100;
      if (!sensor.isActive) healthScore -= 50;
      if (!isOnline) healthScore -= 30;
      healthScore -= criticalAnomalies * 15;
      healthScore -= highAnomalies * 10;
      healthScore -= Math.min(totalUnresolvedAnomalies * 5, 20);
      healthScore = Math.max(0, healthScore);

      // Determine status
      let status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
      if (!sensor.isActive || !isOnline) {
        status = 'OFFLINE';
      } else if (criticalAnomalies > 0 || healthScore < 30) {
        status = 'CRITICAL';
      } else if (highAnomalies > 0 || healthScore < 70) {
        status = 'WARNING';
      } else {
        status = 'HEALTHY';
      }

      return {
        sensor: {
          id: sensor.id,
          sensorCode: sensor.sensorCode,
          sensorType: sensor.sensorType,
          topicName: sensor.topicName,
          isActive: sensor.isActive,
          isSubscribed: sensor.isSubscribed,
          lastHeartbeat: sensor.lastHeartbeat
        },
        metrics: {
          status,
          healthScore: Math.round(healthScore),
          isOnline,
          telemetryCount,
          anomalies: {
            total: anomalies.length,
            unresolved: totalUnresolvedAnomalies,
            critical: criticalAnomalies,
            high: highAnomalies,
            byType: anomalies.reduce((acc, anomaly) => {
              acc[anomaly.anomalyType] = (acc[anomaly.anomalyType] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          }
        }
      };
    });

    const sensorHealthData = await Promise.all(sensorHealthPromises);

    // Calculate overall structure health
    const activeSensors = sensorHealthData.filter(s => s.sensor.isActive);
    const onlineSensors = sensorHealthData.filter(s => s.metrics.isOnline);
    const healthySensors = sensorHealthData.filter(s => s.metrics.status === 'HEALTHY');
    const warningSensors = sensorHealthData.filter(s => s.metrics.status === 'WARNING');
    const criticalSensors = sensorHealthData.filter(s => s.metrics.status === 'CRITICAL');
    
    const averageHealthScore = activeSensors.length > 0 
      ? Math.round(activeSensors.reduce((sum, s) => sum + s.metrics.healthScore, 0) / activeSensors.length)
      : 0;

    let overallStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
    if (activeSensors.length === 0) {
      overallStatus = 'OFFLINE';
    } else if (criticalSensors.length > 0 || averageHealthScore < 40) {
      overallStatus = 'CRITICAL';
    } else if (warningSensors.length > 0 || averageHealthScore < 75) {
      overallStatus = 'WARNING';
    } else {
      overallStatus = 'HEALTHY';
    }

    // Get total anomalies for structure
    const totalAnomalies = await prisma.utilityAnomaly.count({
      where: {
        sensor: {
          structureId: id
        },
        detectedAt: { gte: sinceDate }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        structure: {
          id: structure.id,
          name: structure.name,
          type: structure.type,
          location: structure.location,
          conditionScore: structure.conditionScore,
          riskScore: structure.riskScore
        },
        healthSummary: {
          overallStatus,
          averageHealthScore,
          timeRange: `${hoursBack} hours`,
          sensorsTotal: structure.sensors.length,
          sensorsActive: activeSensors.length,
          sensorsOnline: onlineSensors.length,
          sensorsSubscribed: structure.sensors.filter(s => s.isSubscribed).length,
          statusBreakdown: {
            healthy: healthySensors.length,
            warning: warningSensors.length,
            critical: criticalSensors.length,
            offline: sensorHealthData.filter(s => s.metrics.status === 'OFFLINE').length
          },
          totalAnomalies
        },
        sensors: sensorHealthData
      }
    });

  } catch (error) {
    console.error('❌ Error fetching structure health:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch structure health data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}