import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  haversine,
  sampleRouteCoordinates,
  isPotholeNearRoute,
  orderWaypoints,
} from "@/lib/utils/routing-helpers";

/**
 * GET /api/navigation
 * Multi-pothole opportunistic routing using OSRM
 *
 * Query params:
 *   - start: "lat,lng" (worker's current location)
 *   - end: "lat,lng" (primary pothole target)
 *   - potholeId: (optional) ID of target pothole to exclude from candidates
 *   - multiStop: "true" to enable multi-pothole routing (default: true)
 *   - detourThreshold: max detour multiplier (default: 1.15 = 15% detour)
 *   - corridorWidth: meters to search for nearby potholes (default: 120)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const potholeId = searchParams.get("potholeId");
  const multiStop = searchParams.get("multiStop") !== "false"; // enabled by default
  const detourThreshold = parseFloat(
    searchParams.get("detourThreshold") || "1.15",
  );
  const corridorWidth = parseFloat(searchParams.get("corridorWidth") || "120");

  if (!start || !end) {
    return NextResponse.json(
      { error: "Missing start or end coordinates" },
      { status: 400 },
    );
  }

  try {
    const [sLat, sLng] = start.split(",").map(Number);
    const [eLat, eLng] = end.split(",").map(Number);

    // Validate coordinates
    if (isNaN(sLat) || isNaN(sLng) || isNaN(eLat) || isNaN(eLng)) {
      return NextResponse.json(
        { error: "Invalid coordinate format" },
        { status: 400 },
      );
    }

    // ============================================================
    // STEP 1: Get base route from OSRM (Worker → Target Pothole)
    // ============================================================
    const baseOsrmUrl =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${sLng},${sLat};${eLng},${eLat}` +
      `?overview=full&geometries=geojson`;

    console.log(`🗺️  Step 1: Fetching base route from OSRM...`);

    const baseResponse = await fetch(baseOsrmUrl);
    if (!baseResponse.ok) {
      throw new Error(`OSRM API error: ${baseResponse.statusText}`);
    }

    const baseData = await baseResponse.json();
    if (!baseData.routes || baseData.routes.length === 0) {
      return NextResponse.json(
        { error: "No route found between these locations" },
        { status: 404 },
      );
    }

    const baseRoute = baseData.routes[0];
    const baseDistance = baseRoute.distance;
    const baseGeometry = baseRoute.geometry;
    const routeCoordinates: [number, number][] = baseGeometry.coordinates;

    console.log(
      `✅ Base route: ${(baseDistance / 1000).toFixed(2)} km, ${(baseRoute.duration / 60).toFixed(0)} min`,
    );

    // If multi-stop is disabled, return base route
    if (!multiStop) {
      return NextResponse.json({
        success: true,
        geometry: baseGeometry,
        distance: baseDistance,
        duration: baseRoute.duration,
        waypoints: [],
        detourSavings: 0,
      });
    }

    // ============================================================
    // STEP 2: Find potholes near the route corridor
    // ============================================================
    console.log(`🔍 Step 2: Finding potholes near route corridor...`);

    // Sample route coordinates every ~200m for efficiency
    const sampledCoords = sampleRouteCoordinates(routeCoordinates, 200);

    // Query unassigned high-priority potholes
    const candidatePotholes = await prisma.pothole.findMany({
      where: {
        ticketId: null, // Not already assigned
        priorityLevel: { in: ["HIGH", "CRITICAL"] },
        ...(potholeId && { id: { not: potholeId } }), // Exclude target pothole
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        priorityLevel: true,
        priorityScore: true,
      },
    });

    console.log(`📍 Found ${candidatePotholes.length} candidate potholes`);

    // Filter to potholes within corridor
    const nearbyPotholes = candidatePotholes.filter((p) =>
      isPotholeNearRoute(p.latitude, p.longitude, sampledCoords, corridorWidth),
    );

    console.log(
      `✅ ${nearbyPotholes.length} potholes within ${corridorWidth}m corridor`,
    );

    if (nearbyPotholes.length === 0) {
      // No nearby potholes, return base route
      return NextResponse.json({
        success: true,
        geometry: baseGeometry,
        distance: baseDistance,
        duration: baseRoute.duration,
        waypoints: [],
        detourSavings: 0,
      });
    }

    // ============================================================
    // STEP 3: Evaluate detour benefit for each candidate
    // ============================================================
    console.log(`🧮 Step 3: Evaluating detour costs...`);

    const beneficialPotholes = [];

    for (const pothole of nearbyPotholes) {
      // Check detour cost: distance(A → C) + distance(C → B)
      const detourUrl =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${sLng},${sLat};${pothole.longitude},${pothole.latitude};${eLng},${eLat}` +
        `?overview=false`;

      try {
        const detourResponse = await fetch(detourUrl);
        if (!detourResponse.ok) continue;

        const detourData = await detourResponse.json();
        if (!detourData.routes || detourData.routes.length === 0) continue;

        const detourDistance = detourData.routes[0].distance;
        const detourCost = detourDistance / baseDistance;

        if (detourCost < detourThreshold) {
          beneficialPotholes.push({
            ...pothole,
            detourCost,
            detourDistance,
          });
          console.log(
            `✅ Pothole ${pothole.id}: detour ${(detourCost * 100).toFixed(1)}% (${(detourDistance / 1000).toFixed(2)} km)`,
          );
        }
      } catch (err) {
        console.warn(`⚠️  Failed to evaluate pothole ${pothole.id}:`, err);
      }
    }

    console.log(`📌 ${beneficialPotholes.length} beneficial waypoints found`);

    if (beneficialPotholes.length === 0) {
      // No beneficial stops, return base route
      return NextResponse.json({
        success: true,
        geometry: baseGeometry,
        distance: baseDistance,
        duration: baseRoute.duration,
        waypoints: [],
        detourSavings: 0,
      });
    }

    // ============================================================
    // STEP 4: Order stops using greedy nearest-neighbor
    // ============================================================
    console.log(`🔄 Step 4: Ordering waypoints...`);

    const orderedStops = orderWaypoints(sLat, sLng, beneficialPotholes);

    // ============================================================
    // STEP 5: Get final multi-waypoint route from OSRM
    // ============================================================
    console.log(`🛣️  Step 5: Fetching multi-stop route...`);

    // Build coordinate string: A;C1;C2;...;B
    const waypointCoords = [
      `${sLng},${sLat}`, // Start
      ...orderedStops.map((p) => `${p.longitude},${p.latitude}`),
      `${eLng},${eLat}`, // End
    ].join(";");

    const multiStopUrl =
      `https://router.project-osrm.org/route/v1/driving/${waypointCoords}` +
      `?overview=full&geometries=geojson`;

    const finalResponse = await fetch(multiStopUrl);
    if (!finalResponse.ok) {
      throw new Error(`OSRM multi-stop error: ${finalResponse.statusText}`);
    }

    const finalData = await finalResponse.json();
    if (!finalData.routes || finalData.routes.length === 0) {
      throw new Error("No multi-stop route found");
    }

    const finalRoute = finalData.routes[0];

    console.log(
      `🎉 Final route: ${(finalRoute.distance / 1000).toFixed(2)} km, ` +
        `${(finalRoute.duration / 60).toFixed(0)} min, ` +
        `${orderedStops.length + 1} stops`,
    );

    return NextResponse.json({
      success: true,
      geometry: finalRoute.geometry,
      distance: finalRoute.distance,
      duration: finalRoute.duration,
      waypoints: orderedStops.map((p) => ({
        id: p.id,
        latitude: p.latitude,
        longitude: p.longitude,
        priorityLevel: p.priorityLevel,
      })),
      detourSavings: orderedStops.length, // Number of extra potholes handled
      baseDistance,
      detourPercentage: (
        (finalRoute.distance / baseDistance - 1) *
        100
      ).toFixed(1),
    });
  } catch (error) {
    console.error("❌ Navigation API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch route", details: String(error) },
      { status: 500 },
    );
  }
}
