import L from "leaflet";

/**
 * Enhanced route visualization for multi-waypoint navigation
 */

interface RouteStats {
  distance: number;
  duration: number;
  waypointCount: number;
  detourPercentage?: string;
}

/**
 * Add route statistics popup to the map
 */
export function addRouteStatsPopup(
  map: L.Map,
  stats: RouteStats,
  position: [number, number],
): L.Popup {
  const content = `
    <div style="font-family: system-ui; padding: 4px;">
      <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Route Summary</h4>
      <div style="font-size: 12px; line-height: 1.6;">
        <div>📍 <strong>${(stats.distance / 1000).toFixed(2)} km</strong></div>
        <div>🕒 <strong>${Math.round(stats.duration / 60)} min</strong></div>
        ${
          stats.waypointCount > 0
            ? `
          <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #ddd;">
            🎯 <strong>${stats.waypointCount}</strong> bonus stops
            ${stats.detourPercentage ? `<br/>📊 +${stats.detourPercentage}% detour` : ""}
          </div>
        `
            : ""
        }
      </div>
    </div>
  `;

  const popup = L.popup({
    closeButton: true,
    autoClose: false,
  })
    .setLatLng(position)
    .setContent(content)
    .openOn(map);

  return popup;
}

/**
 * Create custom numbered waypoint marker
 */
export function createWaypointMarker(
  map: L.Map,
  lat: number,
  lng: number,
  index: number,
  info: {
    id: string;
    priorityLevel: string;
  },
): L.Marker {
  const priorityColors: Record<string, string> = {
    CRITICAL: "#ef4444", // red
    HIGH: "#f59e0b", // orange
    MEDIUM: "#eab308", // yellow
    LOW: "#84cc16", // lime
  };

  const color = priorityColors[info.priorityLevel] || "#6b7280";

  const marker = L.marker([lat, lng], {
    icon: L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          font-family: system-ui;
        ">
          ${index}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      className: "",
    }),
  }).addTo(map).bindPopup(`
      <div style="font-family: system-ui; font-size: 13px;">
        <strong>Stop ${index}</strong><br/>
        Priority: <span style="color: ${color}; font-weight: 600;">${info.priorityLevel}</span><br/>
        <span style="font-size: 11px; color: #666;">ID: ${info.id.slice(0, 8)}...</span>
      </div>
    `);

  return marker;
}

/**
 * Highlight active waypoint on the map
 */
export function highlightWaypoint(
  marker: L.Marker,
  map: L.Map,
  duration: number = 2000,
) {
  // Add a pulsing circle around the marker
  const latlng = marker.getLatLng();

  const circle = L.circle(latlng, {
    radius: 50,
    color: "#3b82f6",
    fillColor: "#3b82f6",
    fillOpacity: 0.2,
    weight: 3,
  }).addTo(map);

  // Animate the circle
  let opacity = 0.2;
  const interval = setInterval(() => {
    opacity = opacity === 0.2 ? 0.5 : 0.2;
    circle.setStyle({ fillOpacity: opacity });
  }, 300);

  // Remove after duration
  setTimeout(() => {
    clearInterval(interval);
    map.removeLayer(circle);
  }, duration);

  // Open popup
  marker.openPopup();
}

/**
 * Draw route segments with different colors
 */
export function drawMultiColorRoute(
  map: L.Map,
  waypoints: Array<{ lat: number; lng: number }>,
  options?: {
    colors?: string[];
    weight?: number;
  },
): L.Polyline[] {
  const defaultColors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];
  const colors = options?.colors || defaultColors;
  const weight = options?.weight || 5;

  const polylines: L.Polyline[] = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const color = colors[i % colors.length];
    const polyline = L.polyline(
      [
        [waypoints[i].lat, waypoints[i].lng],
        [waypoints[i + 1].lat, waypoints[i + 1].lng],
      ],
      {
        color,
        weight,
        opacity: 0.7,
      },
    ).addTo(map);

    polylines.push(polyline);
  }

  return polylines;
}

/**
 * Export route data for sharing or saving
 */
export function exportRouteData(result: {
  geometry: GeoJSON.Geometry;
  distance: number;
  duration: number;
  waypoints: Array<{
    id: string;
    latitude: number;
    longitude: number;
    priorityLevel: string;
  }>;
}) {
  const data = {
    type: "Feature",
    properties: {
      distance: result.distance,
      duration: result.duration,
      waypointCount: result.waypoints.length,
      waypoints: result.waypoints,
      exportedAt: new Date().toISOString(),
    },
    geometry: result.geometry,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `route-${Date.now()}.geojson`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Calculate total savings from multi-stop routing
 */
export function calculateRouteSavings(
  waypointCount: number,
  baseDistance: number,
  actualDistance: number,
): {
  potholesHandled: number;
  distancePerPothole: number;
  efficiencyGain: string;
} {
  const totalPotholes = waypointCount + 1; // Including target
  const distancePerPothole = actualDistance / totalPotholes;
  const hypotheticalSeparateTrips = baseDistance * totalPotholes;
  const savings = hypotheticalSeparateTrips - actualDistance;
  const efficiencyGain = ((savings / hypotheticalSeparateTrips) * 100).toFixed(
    1,
  );

  return {
    potholesHandled: totalPotholes,
    distancePerPothole,
    efficiencyGain: `${efficiencyGain}%`,
  };
}

/**
 * Animate route drawing progressively
 */
export async function animateRouteDrawing(
  map: L.Map,
  coordinates: [number, number][],
  options?: {
    color?: string;
    weight?: number;
    speed?: number; // points per frame
  },
): Promise<L.Polyline> {
  const { color = "#3b82f6", weight = 5, speed = 5 } = options || {};

  const polyline = L.polyline([], {
    color,
    weight,
    opacity: 0.7,
  }).addTo(map);

  for (let i = 0; i < coordinates.length; i += speed) {
    const segment = coordinates.slice(0, i + speed);
    polyline.setLatLngs(segment.map(([lng, lat]) => [lat, lng]));
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  // Ensure all coordinates are added
  polyline.setLatLngs(coordinates.map(([lng, lat]) => [lat, lng]));

  return polyline;
}