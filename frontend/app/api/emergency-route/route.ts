import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteWithScore {
  geometry: any;
  distance: number;
  duration: number;
  safetyScore: number;
  potholeCount: number;
  criticalPotholes: number;
  highPotholes: number;
  legs: any[];
}

/**
 * Emergency Routing API
 * Generates multiple routes avoiding roads with verified potholes
 * Ignores PENDING reports (unverified)
 */
export async function POST(request: NextRequest) {
  try {
    const { start, end } = await request.json();

    if (!start || !end || !start.lat || !start.lng || !end.lat || !end.lng) {
      return NextResponse.json(
        { error: "Start and end coordinates required" },
        { status: 400 }
      );
    }

    // Fetch verified potholes (exclude PENDING status)
    const potholes = await prisma.pothole.findMany({
      where: {
        // Only include potholes with tickets (verified)
        ticketId: { not: null },
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        priorityLevel: true,
        ticket: {
          select: {
            status: true,
          },
        },
      },
    });

    // Call OSRM for multiple route alternatives
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?alternatives=3&steps=true&geometries=geojson&overview=full`;
    
    const osrmResponse = await fetch(osrmUrl);
    const osrmData = await osrmResponse.json();

    if (!osrmData.routes || osrmData.routes.length === 0) {
      return NextResponse.json(
        { error: "No routes found" },
        { status: 404 }
      );
    }

    // Score each route based on pothole proximity
    const scoredRoutes: RouteWithScore[] = osrmData.routes.map((route: any) => {
      let potholeCount = 0;
      let criticalPotholes = 0;
      let highPotholes = 0;
      
      // Check each coordinate in route geometry
      const routeCoords = route.geometry.coordinates;
      const PROXIMITY_THRESHOLD = 0.0005; // ~50 meters

      potholes.forEach((pothole) => {
        // Check if pothole is near any point on the route
        const isNearRoute = routeCoords.some((coord: number[]) => {
          const [lng, lat] = coord;
          const distance = Math.sqrt(
            Math.pow(lat - pothole.latitude, 2) +
            Math.pow(lng - pothole.longitude, 2)
          );
          return distance < PROXIMITY_THRESHOLD;
        });

        if (isNearRoute) {
          potholeCount++;
          if (pothole.priorityLevel === 'CRITICAL') criticalPotholes++;
          if (pothole.priorityLevel === 'HIGH') highPotholes++;
        }
      });

      // Calculate safety score (0-100, higher is safer)
      const basePenalty = potholeCount * 5;
      const criticalPenalty = criticalPotholes * 20;
      const highPenalty = highPotholes * 10;
      const totalPenalty = basePenalty + criticalPenalty + highPenalty;
      const safetyScore = Math.max(0, 100 - totalPenalty);

      return {
        geometry: route.geometry,
        distance: route.distance,
        duration: route.duration,
        legs: route.legs,
        safetyScore,
        potholeCount,
        criticalPotholes,
        highPotholes,
      };
    });

    // Sort routes by safety score (highest first)
    scoredRoutes.sort((a, b) => b.safetyScore - a.safetyScore);

    return NextResponse.json({
      routes: scoredRoutes,
      potholes: potholes.map(p => ({
        id: p.id,
        lat: p.latitude,
        lng: p.longitude,
        severity: p.priorityLevel,
        status: p.ticket?.status,
      })),
      summary: {
        totalRoutes: scoredRoutes.length,
        safestRoute: scoredRoutes[0],
        verifiedPotholes: potholes.length,
      },
    });
  } catch (error) {
    console.error("Emergency routing error:", error);
    return NextResponse.json(
      { error: "Failed to generate emergency routes" },
      { status: 500 }
    );
  }
}
