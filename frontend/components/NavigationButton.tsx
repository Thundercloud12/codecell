"use client";

import { useNavigation } from "@/hooks/useNavigation";
import { useEffect, useState } from "react";
import L from "leaflet";

interface NavigationButtonProps {
  potholeLat: number;
  potholeLng: number;
  potholeId?: string | number;
}

/**
 * Button component for OSRM-based road navigation
 * Usage: <NavigationButton potholeLat={lat} potholeLng={lng} />
 */
export default function NavigationButton({
  potholeLat,
  potholeLng,
  potholeId,
}: NavigationButtonProps) {
  const [map, setMap] = useState<L.Map | null>(null);
  const { navigate, isNavigating, error, clearNavigation, navigationResult } =
    useNavigation(map);

  useEffect(() => {
    // Initialize map if needed (or get existing map instance)
    // This is just an example - you'll need to pass your actual map instance
    const mapElement = document.getElementById("map");
    if (mapElement && !map) {
      const newMap = L.map("map").setView([potholeLat, potholeLng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(newMap);
      setMap(newMap);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const handleNavigate = async () => {
    const result = await navigate(
      potholeLat,
      potholeLng,
      potholeId?.toString(),
    );

    if (result) {
      console.log(`Route to pothole ${potholeId}:`, result);

      // Show info about multi-stop optimization
      const waypointInfo =
        result.waypoints.length > 0
          ? ` + ${result.waypoints.length} bonus potholes (${result.detourPercentage}% detour)`
          : "";

      alert(
        `🗺️ Route optimized!\n\n` +
          `Distance: ${result.distanceFormatted}\n` +
          `ETA: ${result.durationFormatted}${waypointInfo}`,
      );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={handleNavigate}
          disabled={isNavigating}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {isNavigating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading Route...
            </span>
          ) : (
            "🧭 Navigate"
          )}
        </button>

        {navigationResult && (
          <button
            onClick={clearNavigation}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Clear Route
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
          ⚠️ {error}
        </div>
      )}

      {navigationResult && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded">
          <div className="font-semibold">
            📍 {navigationResult.distanceFormatted} • 🕒{" "}
            {navigationResult.durationFormatted}
          </div>
          {navigationResult.waypoints.length > 0 && (
            <div className="text-sm mt-1">
              🎯 <strong>{navigationResult.waypoints.length}</strong> additional
              potholes on route ({navigationResult.detourPercentage}% detour)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
