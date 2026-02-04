"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Pothole {
  id: string;
  ticketNumber: string;
  status: string;
  potholes: Array<{
    id: string;
    latitude: number;
    longitude: number;
    priorityLevel: string;
    priorityScore: number;
    roadInfo: {
      roadName: string | null;
    } | null;
  }>;
}

interface WorkerNavigationMapProps {
  potholes: Pothole[];
  workerLocation: { lat: number; lng: number } | null;
  onNavigate?: (
    pothole: Pothole,
    routeInfo: { distance: number; time: number },
  ) => void;
}

// Worker location icon (blue)
const workerIcon = L.divIcon({
  html: `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="#fff" stroke-width="4"/>
      <circle cx="20" cy="20" r="8" fill="#fff"/>
      <text x="20" y="26" text-anchor="middle" fill="#3b82f6" font-family="Arial" font-size="12" font-weight="bold">👤</text>
    </svg>
  `,
  className: "worker-marker",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Pothole icons by priority
const getPotholeIcon = (priorityLevel: string) => {
  const colors: Record<string, string> = {
    CRITICAL: "#dc2626",
    HIGH: "#f97316",
    MEDIUM: "#eab308",
    LOW: "#22c55e",
  };
  const color = colors[priorityLevel] || "#6b7280";

  return L.divIcon({
    html: `
      <svg width="30" height="42" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" 
              fill="${color}" stroke="#fff" stroke-width="2"/>
        <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
      </svg>
    `,
    className: "pothole-marker",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
};

// Map center controller
function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
}

export default function WorkerNavigationMap({
  potholes,
  workerLocation,
  onNavigate,
}: WorkerNavigationMapProps) {
  // Debug log
  console.log("WorkerNavigationMap - workerLocation:", workerLocation);

  const [selectedPothole, setSelectedPothole] = useState<Pothole | null>(null);
  const [destination, setDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    time: number;
  } | null>(null);
  const [routePath, setRoutePath] = useState<{ lat: number; lng: number }[]>(
    [],
  );
  const [routeLoading, setRouteLoading] = useState(false);
  const zoom = 15;

  // Calculate center based on worker location or first pothole
  const center = useMemo<[number, number]>(() => {
    if (workerLocation) {
      return [workerLocation.lat, workerLocation.lng];
    } else if (potholes.length > 0 && potholes[0].potholes[0]) {
      return [
        potholes[0].potholes[0].latitude,
        potholes[0].potholes[0].longitude,
      ];
    }
    return [19.076, 72.8777]; // Default: Mumbai coordinates
  }, [workerLocation, potholes]);

  // Handle navigate button click
  const handleNavigate = async (pothole: Pothole) => {
    if (!workerLocation) {
      alert("Please update your location first to navigate");
      return;
    }

    const primaryPothole = pothole.potholes[0];
    if (!primaryPothole) {
      alert("No pothole location available");
      return;
    }

    setSelectedPothole(pothole);
    const dest = {
      lat: primaryPothole.latitude,
      lng: primaryPothole.longitude,
    };
    setDestination(dest);
    setRouteInfo(null);
    setRouteLoading(true);
    setRoutePath([]);

    try {
      // Call Dijkstra API to calculate shortest route
      const response = await fetch("/api/route/dijkstra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerLat: workerLocation.lat,
          workerLng: workerLocation.lng,
          potholeLat: dest.lat,
          potholeLng: dest.lng,
          radiusMeters: 2000, // 2km radius for better performance
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        throw new Error(
          data.details || data.error || "Failed to calculate route",
        );
      }

      if (data.path && data.path.length > 0) {
        console.log(
          `Route found: ${data.pathNodes} nodes, ${data.summary.distanceKm} km`,
        );
        setRoutePath(data.path);
        setRouteInfo({
          distance: data.distance,
          time: data.duration,
        });
        if (onNavigate) {
          onNavigate(pothole, { distance: data.distance, time: data.duration });
        }
      } else {
        // Fallback to straight line if no route found
        console.warn("No path in response, using straight line");
        setRoutePath([
          { lat: workerLocation.lat, lng: workerLocation.lng },
          { lat: dest.lat, lng: dest.lng },
        ]);
        alert("Could not find road route. Showing direct path.");
      }
    } catch (error) {
      console.error("Route calculation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Fallback to straight line on error
      setRoutePath([
        { lat: workerLocation.lat, lng: workerLocation.lng },
        { lat: dest.lat, lng: dest.lng },
      ]);

      // Show more helpful error message
      if (errorMessage.includes("504") || errorMessage.includes("timeout")) {
        alert(
          "Route service is busy. Showing direct path. Please try again in a moment.",
        );
      } else if (errorMessage.includes("No road network")) {
        alert("No roads found in this area. Showing direct path.");
      } else {
        alert(
          `Route calculation failed: ${errorMessage}. Showing direct path.`,
        );
      }
    } finally {
      setRouteLoading(false);
    }
  };

  // Clear route
  const handleClearRoute = () => {
    setSelectedPothole(null);
    setDestination(null);
    setRouteInfo(null);
    setRoutePath([]);
    setRouteLoading(false);
  };

  // When route is found (deprecated - now handled in handleNavigate)
  const handleRouteFound = (distance: number, time: number) => {
    const info = { distance, time };
    setRouteInfo(info);
    if (selectedPothole && onNavigate) {
      onNavigate(selectedPothole, info);
    }
  };

  // Format distance
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  const getPriorityBadgeClass = (priority: string) => {
    const classes: Record<string, string> = {
      CRITICAL: "bg-red-100 text-red-800 border-red-300",
      HIGH: "bg-orange-100 text-orange-800 border-orange-300",
      MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-300",
      LOW: "bg-green-100 text-green-800 border-green-300",
    };
    return classes[priority] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <div className="space-y-4">
      {/* Loading State */}
      {routeLoading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
          <span className="text-yellow-800 font-medium">
            Calculating optimal route...
          </span>
        </div>
      )}

      {/* Route Info Banner */}
      {routeInfo && selectedPothole && !routeLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-blue-600">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-blue-800">
                Route to {selectedPothole.ticketNumber}
              </div>
              <div className="text-sm text-blue-600">
                {selectedPothole.potholes[0]?.roadInfo?.roadName ||
                  "Unknown Road"}
              </div>
            </div>
            <div className="flex gap-6 ml-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">
                  {formatDistance(routeInfo.distance)}
                </div>
                <div className="text-xs text-blue-600">Distance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">
                  {formatTime(routeInfo.time)}
                </div>
                <div className="text-xs text-blue-600">Est. Time</div>
              </div>
            </div>
          </div>
          <button
            onClick={handleClearRoute}
            className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-100"
          >
            ✕ Clear Route
          </button>
        </div>
      )}

      {/* Map Container */}
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200 shadow-md">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <MapController center={center} zoom={zoom} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Worker Location Marker */}
          {workerLocation && (
            <Marker
              position={[workerLocation.lat, workerLocation.lng]}
              icon={workerIcon}
            >
              <Popup>
                <div className="text-center min-w-[150px]">
                  <strong className="text-blue-600">
                    👤 Your Current Location
                  </strong>
                  <div className="text-sm text-gray-600 mt-1">
                    📍 {workerLocation.lat.toFixed(6)},{" "}
                    {workerLocation.lng.toFixed(6)}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Pothole Markers */}
          {potholes.map((pothole) => {
            const primaryPothole = pothole.potholes[0];
            if (!primaryPothole) return null;
            return (
              <Marker
                key={pothole.id}
                position={[primaryPothole.latitude, primaryPothole.longitude]}
                icon={getPotholeIcon(primaryPothole.priorityLevel)}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="font-bold text-gray-800">
                      {pothole.ticketNumber}
                      {pothole.potholes.length > 1 && (
                        <span className="text-xs text-gray-500">
                          {" "}
                          ({pothole.potholes.length} sites)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {primaryPothole.roadInfo?.roadName || "Unknown Road"}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs border ${getPriorityBadgeClass(
                          primaryPothole.priorityLevel,
                        )}`}
                      >
                        {primaryPothole.priorityLevel}
                      </span>
                      <span className="text-xs text-gray-500">
                        Score: {primaryPothole.priorityScore}
                      </span>
                    </div>
                    <button
                      onClick={() => handleNavigate(pothole)}
                      disabled={!workerLocation || routeLoading}
                      className={`w-full py-2 px-3 rounded text-sm font-medium ${
                        workerLocation && !routeLoading
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {routeLoading ? "Calculating..." : "🧭 Navigate Here"}
                    </button>
                    {!workerLocation && (
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        Update your location first
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Route Polyline */}
          {routePath.length > 0 && (
            <Polyline
              positions={routePath.map((p) => [p.lat, p.lng])}
              color="#3B82F6"
              weight={4}
              opacity={0.7}
            />
          )}
        </MapContainer>
      </div>

      {/* Pothole List with Navigate Buttons */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-700">
            Assigned Potholes ({potholes.length})
          </h3>
        </div>
        <div className="divide-y max-h-[300px] overflow-y-auto">
          {potholes.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              No potholes assigned
            </div>
          ) : (
            potholes.map((pothole) => {
              const primaryPothole = pothole.potholes[0];
              if (!primaryPothole) return null;
              return (
                <div
                  key={pothole.id}
                  className={`p-4 flex items-center justify-between hover:bg-gray-50 ${
                    selectedPothole?.id === pothole.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-mono text-sm font-medium">
                      {pothole.ticketNumber}
                      {pothole.potholes.length > 1 && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({pothole.potholes.length} sites)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {primaryPothole.roadInfo?.roadName || "Unknown Road"}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded text-xs border ${getPriorityBadgeClass(
                          primaryPothole.priorityLevel,
                        )}`}
                      >
                        {primaryPothole.priorityLevel}
                      </span>
                      <span className="text-xs text-gray-500">
                        📍 {primaryPothole.latitude.toFixed(4)},{" "}
                        {primaryPothole.longitude.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavigate(pothole)}
                    disabled={!workerLocation || routeLoading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                      workerLocation && !routeLoading
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {routeLoading ? "..." : "🧭 Navigate"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {!workerLocation && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-sm text-center">
          ⚠️ Update your location using the GPS button above to enable
          navigation
        </div>
      )}
    </div>
  );
}
