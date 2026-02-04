/**
 * POST /api/route/dijkstra
 * Calculate shortest path between worker and pothole using Dijkstra's algorithm
 */

import { NextRequest, NextResponse } from "next/server";
import { buildRoadGraph } from "@/lib/services/osmGraphBuilder";
import { dijkstra, calculatePathDistance } from "@/lib/utils/dijkstra";
import { findNearestNode } from "@/lib/utils/haversine";

interface RouteRequest {
  workerLat: number;
  workerLng: number;
  potholeLat: number;
  potholeLng: number;
  radiusMeters?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: RouteRequest = await request.json();

    const {
      workerLat,
      workerLng,
      potholeLat,
      potholeLng,
      radiusMeters = 2000, // Reduced to 2km for faster queries
    } = body;

    // Validate inputs
    if (
      typeof workerLat !== "number" ||
      typeof workerLng !== "number" ||
      typeof potholeLat !== "number" ||
      typeof potholeLng !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates provided" },
        { status: 400 },
      );
    }

    console.log("Calculating route:", {
      from: `${workerLat}, ${workerLng}`,
      to: `${potholeLat}, ${potholeLng}`,
      radiusMeters,
    });

    // Calculate center point for graph building
    const centerLat = (workerLat + potholeLat) / 2;
    const centerLon = (workerLng + potholeLng) / 2;

    // Build road graph from OSM
    console.log(`Building road graph with ${radiusMeters}m radius...`);
    const { graph, nodes } = await buildRoadGraph(
      centerLat,
      centerLon,
      radiusMeters,
    );

    console.log(`Graph built: ${graph.size} nodes, ${nodes.size} total nodes`);

    if (graph.size === 0 || nodes.size === 0) {
      return NextResponse.json(
        { error: "No road network found in the area" },
        { status: 404 },
      );
    }

    // Find nearest nodes to worker and pothole
    const startNode = findNearestNode(workerLat, workerLng, nodes);
    const endNode = findNearestNode(potholeLat, potholeLng, nodes);

    if (!startNode || !endNode) {
      return NextResponse.json(
        { error: "Could not find nearest road nodes" },
        { status: 404 },
      );
    }

    console.log("Running Dijkstra from", startNode, "to", endNode);

    // Run Dijkstra's algorithm
    const pathNodes = dijkstra(graph, startNode, endNode);

    if (!pathNodes || pathNodes.length === 0) {
      return NextResponse.json(
        { error: "No path found between locations" },
        { status: 404 },
      );
    }

    console.log(`Found path with ${pathNodes.length} nodes`);

    // Convert path nodes to coordinates
    const path = pathNodes
      .map((nodeId) => {
        const node = nodes.get(nodeId);
        return node ? { lat: node.lat, lng: node.lon } : null;
      })
      .filter((coord): coord is { lat: number; lng: number } => coord !== null);

    // Calculate total distance
    const distance = calculatePathDistance(pathNodes, graph);

    // Estimate duration (assuming 40 km/h average speed)
    const averageSpeedKmH = 40;
    const durationSeconds = (distance / 1000 / averageSpeedKmH) * 3600;

    return NextResponse.json({
      success: true,
      path,
      distance, // in meters
      duration: Math.round(durationSeconds), // in seconds
      pathNodes: pathNodes.length,
      summary: {
        distanceKm: (distance / 1000).toFixed(2),
        durationMinutes: Math.round(durationSeconds / 60),
      },
    });
  } catch (error) {
    console.error("Error calculating route:", error);
    return NextResponse.json(
      {
        error: "Failed to calculate route",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}