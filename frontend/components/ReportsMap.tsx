"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom icons for different statuses
const getMarkerIcon = (status: string, hasDetection: boolean) => {
  let color = "#3b82f6"; // blue for PENDING
  if (status === "VERIFIED") color = "#f59e0b"; // amber
  if (status === "RESOLVED") color = "#10b981"; // green

  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" 
            fill="${color}" stroke="#fff" stroke-width="2"/>
      ${hasDetection ? '<circle cx="12.5" cy="12.5" r="4" fill="#fff"/>' : ""}
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: "custom-marker",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

interface Report {
  id: string;
  title?: string;
  description?: string;
  latitude: number;
  longitude: number;
  status: string;
  severity?: number;
  createdAt: string;
  media: Array<{
    id: string;
    mediaUrl: string;
    mediaType: string;
    detections: Array<{
      id: string;
      confidence: number;
      detectedClass: string;
    }>;
  }>;
  user?: {
    name?: string;
    email: string;
  };
}

interface ReportsMapProps {
  reports: Report[];
  selectedReportId?: string;
  onMarkerClick?: (report: Report) => void;
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

export default function ReportsMap({
  reports,
  selectedReportId,
  onMarkerClick,
}: ReportsMapProps) {
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.209]); // Default: New Delhi
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    // Center map on selected report
    if (selectedReportId) {
      const report = reports.find((r) => r.id === selectedReportId);
      if (report) {
        setCenter([report.latitude, report.longitude]);
        setZoom(15);
      }
    } else if (reports.length > 0) {
      // Center on first report if no selection
      setCenter([reports[0].latitude, reports[0].longitude]);
    }
  }, [selectedReportId, reports]);

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-blue-100 text-blue-800",
      VERIFIED: "bg-amber-100 text-amber-800",
      RESOLVED: "bg-green-100 text-green-800",
    };
    return colors[status] || colors.PENDING;
  };

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border border-gray-200 shadow-md">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <MapController center={center} zoom={zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map((report) => {
          const hasDetection = report.media.some(
            (m) => m.detections.length > 0,
          );
          const originalMedia = report.media[0];
          const highestConfidence = Math.max(
            ...report.media.flatMap((m) =>
              m.detections.map((d) => d.confidence),
            ),
            0,
          );

          return (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={getMarkerIcon(report.status, hasDetection)}
              eventHandlers={{
                click: () => onMarkerClick?.(report),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[250px]">
                  <h3 className="font-semibold text-lg mb-2">
                    {report.title || "Pothole Report"}
                  </h3>

                  {originalMedia && (
                    <img
                      src={originalMedia.mediaUrl}
                      alt="Report"
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(report.status)}`}
                      >
                        {report.status}
                      </span>
                    </div>

                    {hasDetection && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">AI Detected:</span>
                        <span className="text-green-600 font-medium">
                          ✓ {(highestConfidence * 100).toFixed(1)}% confidence
                        </span>
                      </div>
                    )}

                    {report.severity && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Severity:</span>
                        <span className="text-red-600 font-medium">
                          {report.severity}/5
                        </span>
                      </div>
                    )}

                    {report.description && (
                      <p className="text-gray-600 text-xs mt-2 line-clamp-2">
                        {report.description}
                      </p>
                    )}

                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
