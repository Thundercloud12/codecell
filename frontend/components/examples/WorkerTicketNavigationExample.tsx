/**
 * Example: Integrate multi-pothole navigation into worker ticket page
 *
 * This shows how to use the navigation system with your existing
 * worker ticket assignment and pothole display logic.
 */

"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigation } from "@/hooks/useNavigation";
import {
  createWaypointMarker,
  addRouteStatsPopup,
  calculateRouteSavings,
} from "@/lib/navigation/route-visualization";

interface Pothole {
  id: string;
  latitude: number;
  longitude: number;
  priorityLevel: string;
  priorityScore?: number;
}

export default function WorkerTicketNavigationExample({
  ticket,
}: {
  ticket: any;
}) {
  const mapRef = useRef<L.Map | null>(null);
  const [selectedPothole, setSelectedPothole] = useState<Pothole | null>(null);
  const { navigate, isNavigating, error, navigationResult, clearNavigation } =
    useNavigation(mapRef.current);

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current) return;

    const map = L.map("worker-map").setView([40.7128, -74.006], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle navigation to selected pothole
  const handleNavigateToPothole = async (pothole: Pothole) => {
    setSelectedPothole(pothole);

    const result = await navigate(
      pothole.latitude,
      pothole.longitude,
      pothole.id,
    );

    if (result && mapRef.current) {
      // Show route statistics
      const midpoint =
        result.geometry.coordinates[
          Math.floor(result.geometry.coordinates.length / 2)
        ];

      addRouteStatsPopup(
        mapRef.current,
        {
          distance: result.distance,
          duration: result.duration,
          waypointCount: result.waypoints.length,
          detourPercentage: result.detourPercentage,
        },
        [midpoint[1], midpoint[0]],
      );

      // Calculate savings
      if (result.waypoints.length > 0 && result.baseDistance) {
        const savings = calculateRouteSavings(
          result.waypoints.length,
          result.baseDistance,
          result.distance,
        );

        console.log("🎉 Route Optimization Savings:", savings);
      }

      // Add custom waypoint markers
      result.waypoints.forEach((waypoint, index) => {
        if (mapRef.current) {
          createWaypointMarker(
            mapRef.current,
            waypoint.latitude,
            waypoint.longitude,
            index + 1,
            {
              id: waypoint.id,
              priorityLevel: waypoint.priorityLevel,
            },
          );
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold">Ticket #{ticket.ticketNumber}</h1>
        <p className="text-gray-600">
          {ticket.potholes?.length || 0} potholes assigned
        </p>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Pothole list sidebar */}
        <div className="w-80 border-r overflow-y-auto bg-gray-50">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Assigned Potholes</h2>

            {ticket.potholes?.map((pothole: Pothole) => (
              <div
                key={pothole.id}
                className={`mb-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPothole?.id === pothole.id
                    ? "bg-blue-100 border-blue-400"
                    : "bg-white hover:bg-gray-50"
                }`}
                onClick={() => setSelectedPothole(pothole)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    Pothole #{pothole.id.slice(0, 8)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      pothole.priorityLevel === "CRITICAL"
                        ? "bg-red-100 text-red-700"
                        : pothole.priorityLevel === "HIGH"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {pothole.priorityLevel}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateToPothole(pothole);
                  }}
                  disabled={isNavigating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded font-medium text-sm transition-colors"
                >
                  {isNavigating && selectedPothole?.id === pothole.id
                    ? "🔄 Calculating Route..."
                    : "🧭 Navigate Here"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <div id="worker-map" className="w-full h-full" />

          {/* Navigation info overlay */}
          {navigationResult && (
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-[1000]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Active Route</h3>
                <button
                  onClick={clearNavigation}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-semibold">
                    {navigationResult.distanceFormatted}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ETA:</span>
                  <span className="font-semibold">
                    {navigationResult.durationFormatted}
                  </span>
                </div>

                {navigationResult.waypoints.length > 0 && (
                  <>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Bonus Stops:</span>
                        <span className="font-semibold text-green-600">
                          {navigationResult.waypoints.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Detour:</span>
                        <span className="font-semibold">
                          +{navigationResult.detourPercentage}%
                        </span>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
                      <p className="text-green-800 text-xs font-medium">
                        🎯 You'll fix{" "}
                        <strong>
                          {navigationResult.waypoints.length + 1} potholes
                        </strong>{" "}
                        in this trip!
                      </p>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  // Start navigation (could open external map app)
                  if (selectedPothole) {
                    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedPothole.latitude},${selectedPothole.longitude}`;
                    window.open(googleMapsUrl, "_blank");
                  }
                }}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                🚗 Start Navigation
              </button>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg z-[1000]">
              <strong className="font-semibold">Navigation Error:</strong>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}