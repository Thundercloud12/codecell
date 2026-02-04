/**
 * Haversine distance calculation between two GPS coordinates
 * Returns distance in meters
 */
export function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Sample route coordinates at regular intervals
 * Returns subset of coordinates spaced ~interval meters apart
 */
export function sampleRouteCoordinates(
  coordinates: [number, number][],
  intervalMeters: number = 200,
): [number, number][] {
  if (coordinates.length === 0) return [];

  const sampled: [number, number][] = [coordinates[0]];
  let accumulatedDistance = 0;

  for (let i = 1; i < coordinates.length; i++) {
    const [lon1, lat1] = coordinates[i - 1];
    const [lon2, lat2] = coordinates[i];
    const segmentDistance = haversine(lat1, lon1, lat2, lon2);

    accumulatedDistance += segmentDistance;

    if (accumulatedDistance >= intervalMeters) {
      sampled.push(coordinates[i]);
      accumulatedDistance = 0;
    }
  }

  // Always include last point
  if (sampled[sampled.length - 1] !== coordinates[coordinates.length - 1]) {
    sampled.push(coordinates[coordinates.length - 1]);
  }

  return sampled;
}

/**
 * Check if a pothole is near any point along the route
 */
export function isPotholeNearRoute(
  potholeLat: number,
  potholeLng: number,
  routeCoordinates: [number, number][],
  maxDistanceMeters: number = 120,
): boolean {
  return routeCoordinates.some((coord) => {
    const [lon, lat] = coord;
    return haversine(potholeLat, potholeLng, lat, lon) < maxDistanceMeters;
  });
}

/**
 * Find nearest pothole to a given location
 */
export function findNearest(
  fromLat: number,
  fromLng: number,
  candidates: Array<{ latitude: number; longitude: number; id: string }>,
): { pothole: (typeof candidates)[0]; distance: number } | null {
  if (candidates.length === 0) return null;

  let nearest = candidates[0];
  let minDistance = haversine(
    fromLat,
    fromLng,
    nearest.latitude,
    nearest.longitude,
  );

  for (let i = 1; i < candidates.length; i++) {
    const distance = haversine(
      fromLat,
      fromLng,
      candidates[i].latitude,
      candidates[i].longitude,
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = candidates[i];
    }
  }

  return { pothole: nearest, distance: minDistance };
}

/**
 * Greedy algorithm to order waypoints by proximity
 */
export function orderWaypoints(
  startLat: number,
  startLng: number,
  waypoints: Array<{ latitude: number; longitude: number; id: string }>,
): Array<{ latitude: number; longitude: number; id: string }> {
  if (waypoints.length === 0) return [];

  const ordered: typeof waypoints = [];
  const remaining = [...waypoints];
  let currentLat = startLat;
  let currentLng = startLng;

  while (remaining.length > 0) {
    const nearest = findNearest(currentLat, currentLng, remaining);
    if (!nearest) break;

    ordered.push(nearest.pothole);
    currentLat = nearest.pothole.latitude;
    currentLng = nearest.pothole.longitude;

    // Remove from remaining
    const index = remaining.findIndex((p) => p.id === nearest.pothole.id);
    if (index !== -1) {
      remaining.splice(index, 1);
    }
  }

  return ordered;
}