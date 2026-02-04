/**
 * GET /api/potholes/nearby
 * Find potholes near a specific location
 * Query params:
 * - potholeId: ID of the pothole to find neighbors for
 * - latitude: center latitude
 * - longitude: center longitude
 * - radius: search radius in meters (default: 500)
 * - excludeWithTickets: exclude potholes that already have tickets (default: true)
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const potholeId = searchParams.get("potholeId");
    const latParam = searchParams.get("latitude");
    const lonParam = searchParams.get("longitude");
    const radiusParam = searchParams.get("radius");
    const excludeWithTickets =
      searchParams.get("excludeWithTickets") !== "false";

    let centerLat: number;
    let centerLon: number;

    // If potholeId is provided, fetch its coordinates
    if (potholeId) {
      const pothole = await prisma.pothole.findUnique({
        where: { id: potholeId },
        select: { latitude: true, longitude: true },
      });

      if (!pothole) {
        return NextResponse.json(
          { error: "Pothole not found" },
          { status: 404 },
        );
      }

      centerLat = pothole.latitude;
      centerLon = pothole.longitude;
    } else if (latParam && lonParam) {
      // Use provided coordinates
      centerLat = parseFloat(latParam);
      centerLon = parseFloat(lonParam);

      if (isNaN(centerLat) || isNaN(centerLon)) {
        return NextResponse.json(
          { error: "Invalid latitude or longitude" },
          { status: 400 },
        );
      }
    } else {
      return NextResponse.json(
        { error: "Either potholeId or latitude/longitude must be provided" },
        { status: 400 },
      );
    }

    const radius = radiusParam ? parseFloat(radiusParam) : 500; // Default 500 meters

    // Build filter
    const where: any = {
      priorityScore: { not: null }, // Only ranked potholes
      priorityLevel: { not: null },
    };

    // Exclude the source pothole if potholeId is provided
    if (potholeId) {
      where.id = { not: potholeId };
    }

    // Optionally exclude potholes that already have tickets
    if (excludeWithTickets) {
      where.ticketId = null;
    }

    // Fetch all potential candidates
    // We'll filter by distance in memory since Prisma doesn't support geo queries natively
    const allPotholes = await prisma.pothole.findMany({
      where,
      include: {
        detection: {
          select: {
            confidence: true,
          },
        },
        roadInfo: {
          select: {
            roadName: true,
            roadType: true,
          },
        },
        ticket: {
          select: {
            id: true,
            ticketNumber: true,
            status: true,
          },
        },
      },
    });

    // Filter by distance and calculate distance for each
    const nearbyPotholes = allPotholes
      .map((pothole) => {
        const distance = calculateDistance(
          centerLat,
          centerLon,
          pothole.latitude,
          pothole.longitude,
        );

        return {
          ...pothole,
          distance, // Distance in meters
        };
      })
      .filter((pothole) => pothole.distance <= radius)
      .sort((a, b) => a.distance - b.distance); // Sort by distance

    return NextResponse.json({
      success: true,
      center: {
        latitude: centerLat,
        longitude: centerLon,
      },
      radius,
      count: nearbyPotholes.length,
      potholes: nearbyPotholes,
    });
  } catch (error) {
    console.error("Error fetching nearby potholes:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
