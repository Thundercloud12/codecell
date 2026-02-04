"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// Custom icons for different priority levels
const getMarkerIcon = (priorityLevel: string | null) => {
  let color = "#3b82f6"; // blue for no priority
  if (priorityLevel === "CRITICAL") color = "#FF1744";
  else if (priorityLevel === "HIGH") color = "#FF9100";
  else if (priorityLevel === "MEDIUM") color = "#FFC400";
  else if (priorityLevel === "LOW") color = "#00E676";

  const svgIcon = `
    <svg width="30" height="45" viewBox="0 0 30 45" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow-${priorityLevel}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M15 0C6.7 0 0 6.7 0 15c0 11.3 15 30 15 30s15-18.7 15-30C30 6.7 23.3 0 15 0z" 
            fill="${color}" stroke="#fff" stroke-width="2" filter="url(#glow-${priorityLevel})"/>
      <circle cx="15" cy="15" r="6" fill="#fff" opacity="0.9"/>
      <circle cx="15" cy="15" r="3" fill="${color}"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: "custom-pothole-marker",
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [0, -40],
  });
};

interface Pothole {
  id: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  priorityScore: number | null;
  priorityLevel: string | null;
  createdAt: string;
  detection: {
    id: string;
    confidence: number;
  };
  roadInfo?: {
    roadName: string | null;
    roadType: string | null;
  } | null;
  ticket?: {
    id: string;
    ticketNumber: string;
    status: string;
  } | null;
}

interface PotholeMapProps {
  potholes: Pothole[];
  selectedPotholeId?: string;
  onMarkerClick?: (pothole: Pothole) => void;
}

// Component to handle map centering
function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

export default function PotholeMap({
  potholes,
  selectedPotholeId,
  onMarkerClick,
}: PotholeMapProps) {
  // Calculate center and zoom based on potholes and selection
  const { center, zoom } = useMemo(() => {
    if (selectedPotholeId) {
      const selected = potholes.find((p) => p.id === selectedPotholeId);
      if (selected) {
        return {
          center: [selected.latitude, selected.longitude] as [number, number],
          zoom: 16
        };
      }
    }
    
    if (potholes.length > 0) {
      const avgLat = potholes.reduce((sum, p) => sum + p.latitude, 0) / potholes.length;
      const avgLng = potholes.reduce((sum, p) => sum + p.longitude, 0) / potholes.length;
      return {
        center: [avgLat, avgLng] as [number, number],
        zoom: 12
      };
    }
    
    return {
      center: [28.6139, 77.209] as [number, number], // Default: New Delhi
      zoom: 12
    };
  }, [selectedPotholeId, potholes]);

  const getPriorityColor = (level: string | null) => {
    switch (level) {
      case "CRITICAL": return "text-[#FF1744]";
      case "HIGH": return "text-[#FF9100]";
      case "MEDIUM": return "text-[#FFC400]";
      case "LOW": return "text-[#00E676]";
      default: return "text-[#94A3B8]";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DETECTED": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "ASSIGNED": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "IN_PROGRESS": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "COMPLETED": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      style={{ background: "#050B16" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapController center={center} zoom={zoom} />

      {potholes.map((pothole) => (
        <Marker
          key={pothole.id}
          position={[pothole.latitude, pothole.longitude]}
          icon={getMarkerIcon(pothole.priorityLevel)}
          eventHandlers={{
            click: () => onMarkerClick?.(pothole),
          }}
        >
          <Popup className="pothole-popup">
            <div className="bg-[#0B1220] text-white p-4 rounded-lg min-w-[280px] border border-[#1F2937]">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-[10px] text-[#94A3B8] font-mono uppercase mb-1">Hazard ID</div>
                  <div className="text-xs font-mono text-[#00B8D4]">{pothole.id.slice(0, 8)}...</div>
                </div>
                {pothole.priorityLevel && (
                  <span className={`text-xs font-bold px-2 py-1 rounded border ${
                    pothole.priorityLevel === "CRITICAL" ? "bg-[#FF1744]/20 text-[#FF1744] border-[#FF1744]/30" :
                    pothole.priorityLevel === "HIGH" ? "bg-[#FF9100]/20 text-[#FF9100] border-[#FF9100]/30" :
                    pothole.priorityLevel === "MEDIUM" ? "bg-[#FFC400]/20 text-[#FFC400] border-[#FFC400]/30" :
                    "bg-[#00E676]/20 text-[#00E676] border-[#00E676]/30"
                  }`}>
                    {pothole.priorityLevel}
                  </span>
                )}
              </div>

              {/* Location Info */}
              {pothole.roadInfo?.roadName && (
                <div className="mb-3">
                  <div className="text-[10px] text-[#94A3B8] font-mono uppercase mb-1">Location</div>
                  <div className="text-sm text-white font-medium">{pothole.roadInfo.roadName}</div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-[#050B16] p-2 rounded border border-[#1F2937]">
                  <div className="text-[10px] text-[#94A3B8] font-mono">AI Confidence</div>
                  <div className="text-sm text-[#00E676] font-bold font-mono">
                    {(pothole.detection.confidence * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-[#050B16] p-2 rounded border border-[#1F2937]">
                  <div className="text-[10px] text-[#94A3B8] font-mono">Priority Score</div>
                  <div className={`text-sm font-bold font-mono ${getPriorityColor(pothole.priorityLevel)}`}>
                    {pothole.priorityScore ?? "N/A"}
                  </div>
                </div>
              </div>

              {/* Ticket Info */}
              {pothole.ticket && (
                <div className="mb-3 p-2 bg-[#050B16] rounded border border-[#1F2937]">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[10px] text-[#94A3B8] font-mono">Ticket</div>
                      <div className="text-xs text-white font-mono">{pothole.ticket.ticketNumber}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${getStatusColor(pothole.ticket.status)}`}>
                      {pothole.ticket.status}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/potholes/${pothole.id}`}
                  className="flex-1 bg-[#00B8D4] text-black text-center py-2 rounded text-xs font-bold hover:bg-[#00B8D4]/80 transition uppercase tracking-wider"
                >
                  View Details
                </Link>
                {pothole.ticket && (
                  <Link
                    href={`/tickets/${pothole.ticket.id}`}
                    className="flex-1 bg-[#00E676] text-black text-center py-2 rounded text-xs font-bold hover:bg-[#00E676]/80 transition uppercase tracking-wider"
                  >
                    View Ticket
                  </Link>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      <style jsx global>{`
        .pothole-popup .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
          padding: 0;
        }
        .pothole-popup .leaflet-popup-content {
          margin: 0;
        }
        .pothole-popup .leaflet-popup-tip {
          background: #0B1220;
          border: 1px solid #1F2937;
        }
        .custom-pothole-marker {
          background: transparent;
          border: none;
        }
      `}</style>
    </MapContainer>
  );
}
