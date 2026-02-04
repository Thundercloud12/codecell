import { useState } from "react";
import L from "leaflet";
import {
  drawRouteOnMap,
  addNavigationMarkers,
  formatDistance,
  formatDuration,
} from "@/lib/navigation/route-drawer";

interface Waypoint {
  id: string;
  latitude: number;
  longitude: number;
  priorityLevel: string;
}

interface NavigationResult {
  geometry: GeoJSON.Geometry;
  distance: number;
  duration: number;
  distanceFormatted: string;
  durationFormatted: string;
  waypoints: Waypoint[];
  detourSavings: number;
  detourPercentage?: string;
  baseDistance?: number;
}

interface UseNavigationReturn {
  navigate: (
    targetLat: number,
    targetLng: number,
    potholeId?: string,
  ) => Promise<NavigationResult | null>;
  clearNavigation: () => void;
  isNavigating: boolean;
  error: string | null;
  routeLayer: L.GeoJSON | null;
  waypointMarkers: L.Marker[];
  navigationResult: NavigationResult | null;
}

/**
 * Hook for managing OSRM-based multi-pothole road navigation
 */
export const useNavigation = (map: L.Map | null): UseNavigationReturn => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeLayer, setRouteLayer] = useState<L.GeoJSON | null>(null);
  const [markers, setMarkers] = useState<{
    startMarker: L.Marker;
    endMarker: L.Marker;
  } | null>(null);
  const [waypointMarkers, setWaypointMarkers] = useState<L.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [navigationResult, setNavigationResult] =
    useState<NavigationResult | null>(null);

  const navigate = async (
    targetLat: number,
    targetLng: number,
    potholeId?: string,
  ): Promise<NavigationResult | null> => {
    if (!map) {
      setError("Map not initialized");
      return null;
    }

    setIsNavigating(true);
    setError(null);

    try {
      // Get user's current position
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        },
      );

      const workerLat = position.coords.latitude;
      const workerLng = position.coords.longitude;

      console.log(
        `🧭 Starting navigation from [${workerLat}, ${workerLng}] to [${targetLat}, ${targetLng}]`,
      ); (with multi-stop optimization)
      const params = new URLSearchParams({
        start: `${workerLat},${workerLng}`,
        end: `${targetLat},${targetLng}`,
      });
      
      if (potholeId) {
        params.append("potholeId", potholeId);
      }

      const response = await fetch(`/api/navigation?${params.toString()}`const response = await fetch(
        `/api/navigation?start=${workerLat},${workerLng}&end=${targetLat},${targetLng}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch route");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Route calculation failed");
      }

      // Clear existing route and markers
      clearNavigation();

      // Draw new route
      const newRouteLayer = drawRouteOnMap(map, data.geometry, {
        color: "#3b82f6",
        weight: 5,
        opacity: 0.7,
      });

      // Add markers
      const newMarkers = addNavigationMarkers(
      // Add waypoint markers for intermediate potholes
      const newWaypointMarkers: L.Marker[] = [];
      if (data.waypoints && data.waypoints.length > 0) {
        data.waypoints.forEach((waypoint: Waypoint, index: number) => {
          const waypointMarker = L.marker([waypoint.latitude, waypoint.longitude], {
            icon: L.divIcon({
              html: `<div style="background-color: #f59e0b; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${index + 1}</div>`,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
              className: "",
            }),
          })
            .addTo(map)
            .bindPopup(`<b>Stop ${index + 1}</b><br>Priority: ${waypoint.priorityLevel}`);

          newWaypointMarkers.push(waypointMarker);
        });
      }

      setRouteLayer(newRouteLayer);
      setMarkers(newMarkers);
      setWaypointMarkers(newWaypointMarkers);

      const result: NavigationResult = {
        geometry: data.geometry,
        distance: data.distance,
        duration: data.duration,
        distanceFormatted: formatDistance(data.distance),
        durationFormatted: formatDuration(data.duration),
        waypoints: data.waypoints || [],
        detourSavings: data.detourSavings || 0,
        detourPercentage: data.detourPercentage,
        baseDistance: data.baseDistance,
      };

      setNavigationResult(result);
      setIsNavigating(false);

      const waypointInfo = result.waypoints.length > 0 
        ? ` with ${result.waypoints.length} additional stops (+${result.detourPercentage}% detour)`
        : "";

      console.log(
        `✅ Navigation ready: ${result.distanceFormatted}, ${result.durationFormatted}${waypointInfo
      };

      setNavigationResult(result);
      setIsNavigating(false);

      console.log(
        `✅ Navigation ready: ${result.distanceFormatted}, ${result.durationFormatted}`,
      );

      return result;
    } catch (err) {
      let errorMessage = "Navigation failed";


    // Clear waypoint markers
    if (waypointMarkers.length > 0 && map) {
      waypointMarkers.forEach((marker) => map.removeLayer(marker));
      setWaypointMarkers([]);
    }
    
    setNavigationResult(null);
    setError(null);
  };

  return {
    navigate,
    clearNavigation,
    isNavigating,
    error,
    routeLayer,
    waypointMarkers,    } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error("❌ Navigation error:", errorMessage);
      setError(errorMessage);
      setIsNavigating(false);
      return null;
    }
  };

  const clearNavigation = () => {
    if (routeLayer && map) {
      map.removeLayer(routeLayer);
      setRouteLayer(null);
    }

    if (markers && map) {
      map.removeLayer(markers.startMarker);
      map.removeLayer(markers.endMarker);
      setMarkers(null);
    }

    setNavigationResult(null);
    setError(null);
  };

  return {
    navigate,
    clearNavigation,
    isNavigating,
    error,
    routeLayer,
    navigationResult,
  };
};
