"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface PotholeMapProps {
  lat: number;
  lng: number;
  roadName?: string | null;
  roadType?: string | null;
}

export default function PotholeMap({
  lat,
  lng,
  roadName,
  roadType,
}: PotholeMapProps) {
  useEffect(() => {
    // Ensure Leaflet is loaded on client side
    if (typeof window !== "undefined") {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    }
  }, []);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={16}
      style={{
        height: "100%",
        width: "100%",
        minHeight: "300px",
        borderRadius: "0.5rem",
      }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={icon}>
        <Popup>
          <div className="text-sm">
            <strong>Pothole Location</strong>
            <br />
            {roadName && (
              <>
                Road: {roadName}
                <br />
              </>
            )}
            {roadType && (
              <>
                Type: {roadType}
                <br />
              </>
            )}
            Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
