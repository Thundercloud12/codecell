"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { UserButton } from "@clerk/nextjs";
import {
  Navigation,
  MapPin,
  AlertTriangle,
  Route as RouteIcon,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

interface RouteOption {
  geometry: {
    coordinates: number[][];
  };
  distance: number;
  duration: number;
  safetyScore: number;
  potholeCount: number;
  criticalPotholes: number;
  highPotholes: number;
}

interface Pothole {
  id: string;
  lat: number;
  lng: number;
  severity: string;
  status: string;
}

export default function EmergencyRoutingPage() {
  const [startPoint, setStartPoint] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [endPoint, setEndPoint] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<number>(0);
  const [mode, setMode] = useState<"start" | "end">("start");
  const [isMounted, setIsMounted] = useState(false);

  const mapCenter: [number, number] = [19.076, 72.8777]; // Mumbai
  const mapZoom = 12;

  // Mount guard for Leaflet
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fix Leaflet default marker icons AFTER mount (safe way)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const L = require("leaflet");

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    }
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStartPoint({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setMode("end");
        },
        () => {
          alert(
            "Unable to get your location. Please click on the map to set start point."
          );
        }
      );
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (mode === "start") {
      setStartPoint({ lat, lng });
      setMode("end");
    } else {
      setEndPoint({ lat, lng });
    }
  };

  const generateRoutes = async () => {
    if (!startPoint || !endPoint) {
      alert("Please set both start and end points");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/emergency-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: startPoint,
          end: endPoint,
        }),
      });

      const data = await response.json();
      setRoutes(data.routes || []);
      setPotholes(data.potholes || []);
      setSelectedRoute(0);
    } catch {
      alert("Failed to generate emergency routes");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStartPoint(null);
    setEndPoint(null);
    setRoutes([]);
    setPotholes([]);
    setMode("start");
    setSelectedRoute(0);
  };

  const ROUTE_COLORS = ["#00E676", "#2196F3", "#FF9800"];

  const SEVERITY_COLORS: Record<string, string> = {
    LOW: "#4CAF50",
    MEDIUM: "#FF9800",
    HIGH: "#F44336",
    CRITICAL: "#B71C1C",
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      {/* HEADER */}
      <div className="border-b border-gray-800 bg-[#0F172A]">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <RouteIcon className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Emergency Routing</h1>
                <p className="text-sm text-gray-400">
                  Find safest routes avoiding verified potholes
                </p>
              </div>
            </div>
          </div>
          <UserButton />
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CONTROL PANEL */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#00E676]" />
                Set Route Points
              </h3>

              <button
                onClick={getCurrentLocation}
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg mb-3"
              >
                Use Current Location as Start
              </button>

              <div className="flex gap-2">
                <button
                  onClick={generateRoutes}
                  disabled={!startPoint || !endPoint || loading}
                  className="flex-1 px-4 py-3 bg-[#00E676] text-black font-semibold rounded-lg"
                >
                  {loading ? "Calculating..." : "Generate Routes"}
                </button>

                <button
                  onClick={reset}
                  className="px-4 py-3 bg-gray-700 rounded-lg"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* ROUTE OPTIONS */}
            {routes.length > 0 && (
              <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold mb-4">Route Options</h3>

                {routes.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedRoute(index)}
                    className={`w-full p-4 rounded-lg border-2 mb-3 text-left ${
                      selectedRoute === index
                        ? "border-[#00E676] bg-[#00E676]/10"
                        : "border-gray-700"
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <span>Route {index + 1}</span>
                      <span>{route.safetyScore}% Safe</span>
                    </div>

                    <div className="text-sm text-gray-400">
                      Distance: {(route.distance / 1000).toFixed(1)} km • Time:{" "}
                      {Math.round(route.duration / 60)} min
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* HAZARD SUMMARY */}
            {potholes.length > 0 && (
              <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Hazard Summary
                </h3>

                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Total Potholes:</span>
                    <span className="font-semibold">{potholes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SEVERITY_COLORS.CRITICAL }} />
                      Critical
                    </span>
                    <span className="font-semibold text-red-400">
                      {potholes.filter(p => p.severity === "CRITICAL").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SEVERITY_COLORS.HIGH }} />
                      High
                    </span>
                    <span className="font-semibold text-orange-400">
                      {potholes.filter(p => p.severity === "HIGH").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SEVERITY_COLORS.MEDIUM }} />
                      Medium
                    </span>
                    <span className="font-semibold">
                      {potholes.filter(p => p.severity === "MEDIUM").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SEVERITY_COLORS.LOW }} />
                      Low
                    </span>
                    <span className="font-semibold">
                      {potholes.filter(p => p.severity === "LOW").length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MAP */}
          <div className="lg:col-span-2">
            <div className="bg-[#1E293B] rounded-xl overflow-hidden border border-gray-800" style={{ height: "700px" }}>
              {!isMounted ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Loading map...
                </div>
              ) : (
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: "100%", width: "100%", zIndex: 0 }}
                  scrollWheelZoom={true}
                  zoomControl={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />

                  <MapClickComponent onMapClick={handleMapClick} />

                  {startPoint && (
                    <Marker position={[startPoint.lat, startPoint.lng]}>
                      <Popup>Start Point</Popup>
                    </Marker>
                  )}

                  {endPoint && (
                    <Marker position={[endPoint.lat, endPoint.lng]}>
                      <Popup>Destination</Popup>
                    </Marker>
                  )}

                  {routes.map((route, index) => (
                    <Polyline
                      key={index}
                      positions={route.geometry.coordinates.map(
                        ([lng, lat]) => [lat, lng]
                      )}
                      color={ROUTE_COLORS[index]}
                      weight={selectedRoute === index ? 6 : 3}
                    />
                  ))}

                  {potholes.map((pothole) => {
                    const L = require("leaflet");
                    const color = SEVERITY_COLORS[pothole.severity] || "#FF0000";

                    return (
                      <Marker
                        key={pothole.id}
                        position={[pothole.lat, pothole.lng]}
                        icon={
                          new L.Icon({
                            iconUrl: `data:image/svg+xml;base64,${btoa(`
                              <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16" cy="16" r="14" fill="${color}" opacity="0.3" stroke="${color}" stroke-width="2"/>
                                <circle cx="16" cy="16" r="8" fill="${color}" opacity="0.8"/>
                                <circle cx="16" cy="16" r="4" fill="white"/>
                              </svg>
                            `)}`,
                            iconSize: [32, 32],
                            iconAnchor: [16, 16],
                            popupAnchor: [0, -16],
                          })
                        }
                      >
                        <Popup>
                          <div style={{ color: "#000", minWidth: "150px" }}>
                            <strong style={{ fontSize: "14px" }}>⚠️ Verified Pothole</strong>
                            <div style={{ marginTop: "8px", fontSize: "12px" }}>
                              <div><strong>Severity:</strong> <span style={{ color: color, fontWeight: "bold" }}>{pothole.severity}</span></div>
                              <div><strong>Status:</strong> {pothole.status}</div>
                              <div style={{ marginTop: "4px", fontSize: "11px", color: "#666" }}>
                                {pothole.lat.toFixed(5)}, {pothole.lng.toFixed(5)}
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Map click handler (must be outside main component)
function MapClickComponent({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  if (typeof window === "undefined") return null;

  const { useMapEvents } = require("react-leaflet");

  useMapEvents({
    click: (e: any) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}
