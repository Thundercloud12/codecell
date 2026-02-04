import L from "leaflet";

/**
 * Draw a route on a Leaflet map using GeoJSON geometry
 */
export const drawRouteOnMap = (
  map: L.Map,
  geometry: GeoJSON.Geometry,
  options?: {
    color?: string;
    weight?: number;
    opacity?: number;
  },
): L.GeoJSON => {
  const defaultOptions = {
    color: "#3b82f6", // Blue
    weight: 5,
    opacity: 0.7,
    ...options,
  };

  const routeLayer = L.geoJSON(geometry, {
    style: defaultOptions,
  }).addTo(map);

  // Fit map to route bounds with padding
  map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });

  return routeLayer;
};

/**
 * Clear route layer from map
 */
export const clearRoute = (routeLayer: L.GeoJSON | null, map: L.Map) => {
  if (routeLayer) {
    map.removeLayer(routeLayer);
  }
};

/**
 * Add start and end markers to the map
 */
export const addNavigationMarkers = (
  map: L.Map,
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
) => {
  // Start marker (worker location)
  const startMarker = L.marker([startLat, startLng], {
    icon: L.divIcon({
      html: '<div style="background-color: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      className: "",
    }),
  })
    .addTo(map)
    .bindPopup("<b>Your Location</b>");

  // End marker (pothole location)
  const endMarker = L.marker([endLat, endLng], {
    icon: L.divIcon({
      html: '<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      className: "",
    }),
  })
    .addTo(map)
    .bindPopup("<b>Pothole Location</b>");

  return { startMarker, endMarker };
};

/**
 * Format distance for display
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
};

/**
 * Format duration for display
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes} min`;
};
