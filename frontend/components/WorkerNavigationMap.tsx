"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Types for routing machine
interface RouteSummary {
  totalDistance: number;
  totalTime: number;
}

interface RouteInfo {
  summary: RouteSummary;
}

interface RoutingResultEvent {
  routes: RouteInfo[];
}

interface Pothole {
  id: string;
  ticketNumber: string;
  status: string;
  pothole: {
    latitude: number;
    longitude: number;
    priorityLevel: string;
    priorityScore: number;
    roadInfo: {
      roadName: string | null;
    } | null;
  };
}

interface WorkerNavigationMapProps {
  potholes: Pothole[];
  workerLocation: { lat: number; lng: number } | null;
  onNavigate?: (pothole: Pothole, routeInfo: { distance: number; time: number }) => void;
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

// Routing control component
function RoutingMachine({
  workerLocation,
  destination,
  onRouteFound,
}: {
  workerLocation: { lat: number; lng: number };
  destination: { lat: number; lng: number } | null;
  onRouteFound: (distance: number, time: number) => void;
}) {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!destination || !workerLocation) {
      // Remove existing route if no destination
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    // Dynamic import for leaflet-routing-machine (client-side only)
    import("leaflet-routing-machine").then(() => {
      // Remove existing route control
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }

      // Create new routing control
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const routingControl = (L.Routing as any).control({
        waypoints: [
          L.latLng(workerLocation.lat, workerLocation.lng),
          L.latLng(destination.lat, destination.lng),
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        addWaypoints: false,
        fitSelectedRoutes: true,
        lineOptions: {
          styles: [{ color: "#3b82f6", weight: 5, opacity: 0.8 }],
          extendToWaypoints: true,
          missingRouteTolerance: 0,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router: (L.Routing as any).osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
        }),
        // Hide the itinerary panel
        show: false,
        collapsible: true,
      });

      routingControl.on("routesfound", (e: RoutingResultEvent) => {
        const routes = e.routes;
        if (routes && routes.length > 0) {
          const summary = routes[0].summary;
          onRouteFound(summary.totalDistance, summary.totalTime);
        }
      });

      routingControl.addTo(map);
      routingControlRef.current = routingControl;
    });

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [map, workerLocation, destination, onRouteFound]);

  return null;
}

// Map center controller
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
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
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; time: number } | null>(null);
  const zoom = 15;

  // Calculate center based on worker location or first pothole
  const center = useMemo<[number, number]>(() => {
    if (workerLocation) {
      return [workerLocation.lat, workerLocation.lng];
    } else if (potholes.length > 0) {
      return [potholes[0].pothole.latitude, potholes[0].pothole.longitude];
    }
    return [19.076, 72.8777]; // Default: Mumbai coordinates
  }, [workerLocation, potholes]);

  // Handle navigate button click
  const handleNavigate = (pothole: Pothole) => {
    if (!workerLocation) {
      alert("Please update your location first to navigate");
      return;
    }

    setSelectedPothole(pothole);
    setDestination({
      lat: pothole.pothole.latitude,
      lng: pothole.pothole.longitude,
    });
    setRouteInfo(null); // Reset while calculating
  };

  // Clear route
  const handleClearRoute = () => {
    setSelectedPothole(null);
    setDestination(null);
    setRouteInfo(null);
  };

  // When route is found
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
      {/* Route Info Banner */}
      {routeInfo && selectedPothole && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-blue-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-blue-800">
                Route to {selectedPothole.ticketNumber}
              </div>
              <div className="text-sm text-blue-600">
                {selectedPothole.pothole.roadInfo?.roadName || "Unknown Road"}
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
            <Marker position={[workerLocation.lat, workerLocation.lng]} icon={workerIcon}>
              <Popup>
                <div className="text-center min-w-[150px]">
                  <strong className="text-blue-600">👤 Your Current Location</strong>
                  <div className="text-sm text-gray-600 mt-1">
                    📍 {workerLocation.lat.toFixed(6)}, {workerLocation.lng.toFixed(6)}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Pothole Markers */}
          {potholes.map((pothole) => (
            <Marker
              key={pothole.id}
              position={[pothole.pothole.latitude, pothole.pothole.longitude]}
              icon={getPotholeIcon(pothole.pothole.priorityLevel)}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="font-bold text-gray-800">{pothole.ticketNumber}</div>
                  <div className="text-sm text-gray-600 mb-2">
                    {pothole.pothole.roadInfo?.roadName || "Unknown Road"}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs border ${getPriorityBadgeClass(
                        pothole.pothole.priorityLevel
                      )}`}
                    >
                      {pothole.pothole.priorityLevel}
                    </span>
                    <span className="text-xs text-gray-500">
                      Score: {pothole.pothole.priorityScore}
                    </span>
                  </div>
                  <button
                    onClick={() => handleNavigate(pothole)}
                    disabled={!workerLocation}
                    className={`w-full py-2 px-3 rounded text-sm font-medium ${
                      workerLocation
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    🧭 Navigate Here
                  </button>
                  {!workerLocation && (
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Update your location first
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Routing Machine */}
          {workerLocation && destination && (
            <RoutingMachine
              workerLocation={workerLocation}
              destination={destination}
              onRouteFound={handleRouteFound}
            />
          )}
        </MapContainer>
      </div>

      {/* Pothole List with Navigate Buttons */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-700">Assigned Potholes ({potholes.length})</h3>
        </div>
        <div className="divide-y max-h-[300px] overflow-y-auto">
          {potholes.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">No potholes assigned</div>
          ) : (
            potholes.map((pothole) => (
              <div
                key={pothole.id}
                className={`p-4 flex items-center justify-between hover:bg-gray-50 ${
                  selectedPothole?.id === pothole.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="font-mono text-sm font-medium">{pothole.ticketNumber}</div>
                  <div className="text-sm text-gray-600">
                    {pothole.pothole.roadInfo?.roadName || "Unknown Road"}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded text-xs border ${getPriorityBadgeClass(
                        pothole.pothole.priorityLevel
                      )}`}
                    >
                      {pothole.pothole.priorityLevel}
                    </span>
                    <span className="text-xs text-gray-500">
                      📍 {pothole.pothole.latitude.toFixed(4)}, {pothole.pothole.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigate(pothole)}
                  disabled={!workerLocation}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    workerLocation
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  🧭 Navigate
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {!workerLocation && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-sm text-center">
          ⚠️ Update your location using the GPS button above to enable navigation
        </div>
      )}
    </div>
  );
}
