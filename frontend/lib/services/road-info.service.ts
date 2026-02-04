/**
 * Road Info Service
 * Fetches road metadata from Overpass API (OpenStreetMap)
 * Used to determine road context for pothole priority ranking
 */

interface OverpassElement {
  type: string;
  id: number;
  tags?: {
    name?: string;
    highway?: string;
    maxspeed?: string;
    lanes?: string;
    surface?: string;
    [key: string]: string | undefined;
  };
  geometry?: Array<{ lat: number; lon: number }>;
}

interface OverpassResponse {
  version: number;
  generator: string;
  elements: OverpassElement[];
}

export interface RoadMetadata {
  roadName: string | null;
  roadType: string | null;
  speedLimit: number | null;
  trafficImportance: number;
  priorityFactor: number;
  osmData: OverpassElement | null;
}

/**
 * Query Overpass API for road information near pothole coordinates
 * @param latitude Pothole latitude
 * @param longitude Pothole longitude
 * @param radiusMeters Search radius (default: 50m)
 */
export async function fetchRoadInfo(
  latitude: number,
  longitude: number,
  radiusMeters: number = 50,
): Promise<RoadMetadata> {
  try {
    // Overpass QL query: Find roads within radius of coordinates
    const query = `
      [out:json];
      way(around:${radiusMeters},${latitude},${longitude})["highway"];
      out geom;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data: OverpassResponse = await response.json();

    // Find the closest road to the pothole
    const road = findClosestRoad(data.elements, latitude, longitude);

    if (!road) {
      console.warn(`No road found near coordinates: ${latitude}, ${longitude}`);
      return getDefaultRoadMetadata();
    }

    return parseRoadMetadata(road);
  } catch (error) {
    console.error("Error fetching road info:", error);
    // Return defaults on error rather than failing
    return getDefaultRoadMetadata();
  }
}

/**
 * Find the road element closest to pothole coordinates
 */
function findClosestRoad(
  elements: OverpassElement[],
  latitude: number,
  longitude: number,
): OverpassElement | null {
  if (elements.length === 0) return null;

  // If only one road, return it
  if (elements.length === 1) return elements[0];

  // Find closest road by checking geometry points
  let closestRoad = elements[0];
  let minDistance = Number.MAX_VALUE;

  for (const element of elements) {
    if (!element.geometry || element.geometry.length === 0) continue;

    // Calculate distance to nearest point on road
    for (const point of element.geometry) {
      const distance = calculateDistance(
        latitude,
        longitude,
        point.lat,
        point.lon,
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestRoad = element;
      }
    }
  }

  return closestRoad;
}

/**
 * Parse OSM road data into structured metadata
 */
function parseRoadMetadata(road: OverpassElement): RoadMetadata {
  const tags = road.tags || {};

  const roadType = tags.highway || null;
  const roadName = tags.name || null;
  const speedLimit = tags.maxspeed ? parseInt(tags.maxspeed) : null;

  // Calculate traffic importance based on road type
  const trafficImportance = calculateTrafficImportance(roadType);

  // Calculate priority factor (composite of multiple factors)
  const priorityFactor = calculatePriorityFactor(
    roadType,
    speedLimit,
    trafficImportance,
  );

  return {
    roadName,
    roadType,
    speedLimit,
    trafficImportance,
    priorityFactor,
    osmData: road,
  };
}

/**
 * Calculate traffic importance based on OSM highway classification
 * Higher values = more important roads
 */
function calculateTrafficImportance(roadType: string | null): number {
  if (!roadType) return 1.0;

  const importanceMap: Record<string, number> = {
    motorway: 5.0,
    trunk: 4.5,
    primary: 4.0,
    secondary: 3.5,
    tertiary: 3.0,
    unclassified: 2.5,
    residential: 2.0,
    service: 1.5,
    track: 1.0,
    path: 0.5,
  };

  return importanceMap[roadType] || 2.0;
}

/**
 * Calculate priority factor for ranking algorithm
 * Combines road type, speed limit, and traffic importance
 */
function calculatePriorityFactor(
  roadType: string | null,
  speedLimit: number | null,
  trafficImportance: number,
): number {
  let factor = trafficImportance;

  // Speed limit multiplier (higher speed = higher priority)
  if (speedLimit) {
    if (speedLimit >= 80) factor *= 1.3;
    else if (speedLimit >= 60) factor *= 1.2;
    else if (speedLimit >= 40) factor *= 1.1;
  }

  // Road type specific adjustments
  if (roadType === "motorway" || roadType === "trunk") {
    factor *= 1.25; // Critical infrastructure
  } else if (roadType === "primary" || roadType === "secondary") {
    factor *= 1.15; // Major roads
  }

  return Math.round(factor * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate Haversine distance between two coordinates (in meters)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Default road metadata when API fails or no road found
 */
function getDefaultRoadMetadata(): RoadMetadata {
  return {
    roadName: null,
    roadType: null,
    speedLimit: null,
    trafficImportance: 2.0, // Moderate default
    priorityFactor: 2.0,
    osmData: null,
  };
}
