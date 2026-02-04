/**
 * Routing Service
 * Integrates with OSRM (Open Source Routing Machine) API
 * Generates navigation routes for workers to pothole locations
 */

interface OSRMRoute {
  distance: number; // meters
  duration: number; // seconds
  geometry: string; // encoded polyline
}

interface OSRMWaypoint {
  location: [number, number]; // [longitude, latitude]
  name: string;
}

interface OSRMResponse {
  code: string;
  routes: OSRMRoute[];
  waypoints: OSRMWaypoint[];
}

export interface RouteData {
  distance: number; // meters
  duration: number; // seconds
  polyline: string; // encoded polyline for map display
  estimatedArrival: Date;
  startLocation: {
    latitude: number;
    longitude: number;
  };
  endLocation: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Generate route from worker's current location to pothole location
 * Uses OSRM public API for routing
 *
 * @param startLat Worker's current latitude
 * @param startLon Worker's current longitude
 * @param endLat Pothole latitude
 * @param endLon Pothole longitude
 * @returns Route data including polyline and ETA
 */
export async function generateRoute(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
): Promise<RouteData> {
  try {
    // OSRM API endpoint (public instance)
    // Format: /route/v1/{profile}/{coordinates}
    // Coordinates: longitude,latitude (note: lon,lat not lat,lon!)
    const url = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}`;

    const params = new URLSearchParams({
      overview: "full", // Get full route geometry
      geometries: "polyline", // Return encoded polyline
      steps: "false", // We don't need turn-by-turn instructions
    });

    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }

    const data: OSRMResponse = await response.json();

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      throw new Error(`OSRM routing failed: ${data.code}`);
    }

    const route = data.routes[0];

    // Calculate ETA
    const now = new Date();
    const estimatedArrival = new Date(now.getTime() + route.duration * 1000);

    return {
      distance: route.distance,
      duration: route.duration,
      polyline: route.geometry,
      estimatedArrival,
      startLocation: {
        latitude: startLat,
        longitude: startLon,
      },
      endLocation: {
        latitude: endLat,
        longitude: endLon,
      },
    };
  } catch (error) {
    console.error("Error generating route:", error);
    throw new Error(`Failed to generate route: ${error}`);
  }
}

/**
 * Calculate straight-line distance between two coordinates (meters)
 * Useful for quick distance checks before calling routing API
 */
export function calculateStraightLineDistance(
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
 * Format route duration in human-readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.round(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
}

/**
 * Format distance in human-readable format
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} meters`;
  } else {
    const km = (meters / 1000).toFixed(1);
    return `${km} km`;
  }
}

/**
 * Decode polyline to array of coordinates
 * Useful for displaying route on map
 * Format: [[lat, lon], [lat, lon], ...]
 */
export function decodePolyline(encoded: string): [number, number][] {
  const coordinates: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    coordinates.push([lat / 1e5, lng / 1e5]);
  }

  return coordinates;
}
