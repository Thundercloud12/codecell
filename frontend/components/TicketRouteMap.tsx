"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Decode polyline from OSRM response
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

// Worker location icon
const workerIcon = L.divIcon({
  html: `
    <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="worker-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="22" cy="22" r="18" fill="#00B8D4" stroke="#fff" stroke-width="3" filter="url(#worker-glow)"/>
      <circle cx="22" cy="22" r="8" fill="#fff"/>
      <circle cx="22" cy="22" r="4" fill="#00B8D4"/>
    </svg>
  `,
  className: "worker-marker",
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

// Pothole destination icon
const getPotholeIcon = (priorityLevel: string) => {
  const colors: Record<string, string> = {
    CRITICAL: "#FF1744",
    HIGH: "#FF9100",
    MEDIUM: "#FFC400",
    LOW: "#00E676",
  };
  const color = colors[priorityLevel] || "#94A3B8";

  return L.divIcon({
    html: `
      <svg width="36" height="50" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="pothole-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d="M15 0C6.7 0 0 6.7 0 15c0 11.3 15 27 15 27s15-15.7 15-27C30 6.7 23.3 0 15 0z" 
              fill="${color}" stroke="#fff" stroke-width="2" filter="url(#pothole-glow)"/>
        <circle cx="15" cy="15" r="7" fill="#fff"/>
        <circle cx="15" cy="15" r="4" fill="${color}"/>
      </svg>
    `,
    className: "pothole-marker",
    iconSize: [36, 50],
    iconAnchor: [18, 50],
    popupAnchor: [0, -45],
  });
};

interface TicketRouteMapProps {
  workerLocation: { lat: number; lng: number } | null;
  potholeLocation: { lat: number; lng: number };
  priorityLevel: string;
  routePolyline?: string;
  roadName?: string;
  ticketNumber: string;
}

// Component to handle map bounds
function MapBoundsController({
  workerLocation,
  potholeLocation,
}: {
  workerLocation: { lat: number; lng: number } | null;
  potholeLocation: { lat: number; lng: number };
}) {
  const map = useMap();

  useEffect(() => {
    if (workerLocation) {
      const bounds = L.latLngBounds([
        [workerLocation.lat, workerLocation.lng],
        [potholeLocation.lat, potholeLocation.lng],
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([potholeLocation.lat, potholeLocation.lng], 15);
    }
  }, [workerLocation, potholeLocation, map]);

  return null;
}

export default function TicketRouteMap({
  workerLocation,
  potholeLocation,
  priorityLevel,
  routePolyline,
  roadName,
  ticketNumber,
}: TicketRouteMapProps) {
  // Decode polyline if provided
  const routeCoordinates = useMemo(() => {
    if (!routePolyline) return null;
    try {
      return decodePolyline(routePolyline);
    } catch (e) {
      console.error("Failed to decode polyline:", e);
      return null;
    }
  }, [routePolyline]);

  const defaultCenter: [number, number] = workerLocation
    ? [workerLocation.lat, workerLocation.lng]
    : [potholeLocation.lat, potholeLocation.lng];

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        className="h-full w-full rounded-xl"
        style={{ background: "#050B16" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapBoundsController 
          workerLocation={workerLocation} 
          potholeLocation={potholeLocation} 
        />

        {/* Route polyline */}
        {routeCoordinates && (
          <>
            {/* Shadow line */}
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: "#000",
                weight: 8,
                opacity: 0.3,
              }}
            />
            {/* Main route line */}
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: "#00B8D4",
                weight: 5,
                opacity: 0.9,
              }}
            />
            {/* Animated dashed overlay */}
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: "#00E676",
                weight: 3,
                opacity: 0.7,
                dashArray: "10, 20",
              }}
            />
          </>
        )}

        {/* Worker marker */}
        {workerLocation && (
          <Marker position={[workerLocation.lat, workerLocation.lng]} icon={workerIcon}>
            <Popup>
              <div className="bg-[#0B1220] text-white p-3 rounded-lg min-w-[180px] border border-[#1F2937]">
                <div className="text-[10px] text-[#00B8D4] font-mono uppercase mb-1">Worker Location</div>
                <div className="text-sm font-bold">Current Position</div>
                <div className="text-[10px] text-[#94A3B8] font-mono mt-1">
                  {workerLocation.lat.toFixed(6)}, {workerLocation.lng.toFixed(6)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Pothole destination marker */}
        <Marker
          position={[potholeLocation.lat, potholeLocation.lng]}
          icon={getPotholeIcon(priorityLevel)}
        >
          <Popup>
            <div className="bg-[#0B1220] text-white p-3 rounded-lg min-w-[200px] border border-[#1F2937]">
              <div className="text-[10px] text-[#FF1744] font-mono uppercase mb-1">Destination</div>
              <div className="text-sm font-bold mb-1">{ticketNumber}</div>
              {roadName && (
                <div className="text-xs text-[#94A3B8] mb-2">📍 {roadName}</div>
              )}
              <div className={`inline-block text-[10px] font-bold px-2 py-1 rounded ${
                priorityLevel === "CRITICAL" ? "bg-[#FF1744]/20 text-[#FF1744]" :
                priorityLevel === "HIGH" ? "bg-[#FF9100]/20 text-[#FF9100]" :
                priorityLevel === "MEDIUM" ? "bg-[#FFC400]/20 text-[#FFC400]" :
                "bg-[#00E676]/20 text-[#00E676]"
              }`}>
                {priorityLevel} PRIORITY
              </div>
            </div>
          </Popup>
        </Marker>

        <style jsx global>{`
          .worker-marker, .pothole-marker {
            background: transparent;
            border: none;
          }
          .leaflet-popup-content-wrapper {
            background: transparent;
            box-shadow: none;
            padding: 0;
          }
          .leaflet-popup-content {
            margin: 0;
          }
          .leaflet-popup-tip {
            background: #0B1220;
            border: 1px solid #1F2937;
          }
        `}</style>
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-[#050B16]/90 backdrop-blur border border-[#1F2937] p-3 rounded-lg">
        <div className="text-[10px] text-[#94A3B8] font-mono uppercase mb-2">Legend</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-white">
            <span className="w-3 h-3 rounded-full bg-[#00B8D4]"></span>
            Worker Location
          </div>
          <div className="flex items-center gap-2 text-xs text-white">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: priorityLevel === "CRITICAL" ? "#FF1744" : priorityLevel === "HIGH" ? "#FF9100" : priorityLevel === "MEDIUM" ? "#FFC400" : "#00E676" }}></span>
            Pothole Destination
          </div>
          {routeCoordinates && (
            <div className="flex items-center gap-2 text-xs text-white">
              <span className="w-6 h-0.5 bg-[#00B8D4]"></span>
              Route Path
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
