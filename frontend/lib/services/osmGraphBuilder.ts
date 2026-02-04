import { haversineDistance } from "../utils/haversine";
import { Graph } from "../utils/dijkstra";

interface OSMNode {
  type: "node";
  id: number;
  lat: number;
  lon: number;
}

interface OSMWay {
  type: "way";
  id: number;
  nodes: number[];
  tags?: {
    highway?: string;
    name?: string;
  };
}

interface OSMResponse {
  elements: (OSMNode | OSMWay)[];
}

// Cache for road graphs (keyed by area)
const graphCache = new Map<
  string,
  {
    graph: Graph;
    nodes: Map<string, { lat: number; lon: number }>;
    timestamp: number;
  }
>();

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Build road graph from OpenStreetMap data
 */
export async function buildRoadGraph(
  centerLat: number,
  centerLon: number,
  radiusMeters: number = 2000,
): Promise<{
  graph: Graph;
  nodes: Map<string, { lat: number; lon: number }>;
}> {
  // Check cache
  const cacheKey = `${centerLat.toFixed(3)},${centerLon.toFixed(3)},${radiusMeters}`;
  const cached = graphCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Using cached road graph");
    return { graph: cached.graph, nodes: cached.nodes };
  }

  console.log("Building new road graph from OSM...");

  // Convert radius to bbox (approximate)
  const latDelta = radiusMeters / 111320; // 1 degree latitude ≈ 111km
  const lonDelta =
    radiusMeters / (111320 * Math.cos((centerLat * Math.PI) / 180));

  const bbox = {
    south: centerLat - latDelta,
    north: centerLat + latDelta,
    west: centerLon - lonDelta,
    east: centerLon + lonDelta,
  };

  // Overpass API query for roads (increased timeout to 90s)
  const query = `
    [out:json][timeout:90];
    (
      way["highway"~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|service|motorway_link|trunk_link|primary_link|secondary_link|tertiary_link)$"]
        (${bbox.south},${bbox.west},${bbox.north},${bbox.east});
    );
    out body;
    >;
    out skel qt;
  `;

  // Multiple Overpass API mirrors for fallback
  const overpassEndpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.ru/api/interpreter",
  ];

  let lastError: Error | null = null;

  // Try each endpoint until one succeeds
  for (const endpoint of overpassEndpoints) {
    try {
      console.log(`Trying Overpass API: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "POST",
        body: query,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }

      console.log(`Successfully fetched data from ${endpoint}`);

      const data: OSMResponse = await response.json();

      // Build graph
      const graph: Graph = new Map();
      const nodes = new Map<string, { lat: number; lon: number }>();

      // First pass: collect all nodes
      const osmNodes = data.elements.filter(
        (el) => el.type === "node",
      ) as OSMNode[];
      for (const node of osmNodes) {
        nodes.set(String(node.id), { lat: node.lat, lon: node.lon });
      }

      // Second pass: build graph from ways
      const osmWays = data.elements.filter(
        (el) => el.type === "way",
      ) as OSMWay[];

      for (const way of osmWays) {
        const wayNodes = way.nodes;

        // Connect consecutive nodes in the way
        for (let i = 0; i < wayNodes.length - 1; i++) {
          const node1Id = String(wayNodes[i]);
          const node2Id = String(wayNodes[i + 1]);

          const node1 = nodes.get(node1Id);
          const node2 = nodes.get(node2Id);

          if (!node1 || !node2) continue;

          // Calculate edge weight (distance)
          const distance = haversineDistance(
            node1.lat,
            node1.lon,
            node2.lat,
            node2.lon,
          );

          // Add bidirectional edges (assuming roads are bidirectional)
          if (!graph.has(node1Id)) {
            graph.set(node1Id, []);
          }
          if (!graph.has(node2Id)) {
            graph.set(node2Id, []);
          }

          graph.get(node1Id)!.push({ id: node2Id, weight: distance });
          graph.get(node2Id)!.push({ id: node1Id, weight: distance });
        }
      }

      console.log(
        `Built graph with ${nodes.size} nodes and ${graph.size} connected nodes`,
      );

      // Cache the result
      graphCache.set(cacheKey, {
        graph,
        nodes,
        timestamp: Date.now(),
      });

      return { graph, nodes };
    } catch (error) {
      console.error(`Error with ${endpoint}:`, error);
      lastError = error as Error;
      // Continue to next endpoint
    }
  }

  // If all endpoints failed, throw the last error
  console.error("All Overpass API endpoints failed");
  throw new Error(
    `Failed to fetch road data from all Overpass API mirrors. Last error: ${lastError?.message || "Unknown error"}`,
  );
}

/**
 * Clear cache (useful for testing)
 */
export function clearGraphCache(): void {
  graphCache.clear();
}
