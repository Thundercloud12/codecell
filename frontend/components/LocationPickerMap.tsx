"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerMapProps {
  latitude: string;
  longitude: string;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string;
}

/**
 * Interactive map component for picking location coordinates
 * Click anywhere on the map to select coordinates
 */
export default function LocationPickerMap({
  latitude,
  longitude,
  onLocationSelect,
  height = "400px",
}: LocationPickerMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current) return;

    // Default center (will be updated if coordinates provided)
    const defaultLat = 40.7128;
    const defaultLng = -74.006;

    const map = L.map("location-picker-map", {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([defaultLat, defaultLng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    setMapReady(true);

    // Handle map clicks
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
      updateMarker(lat, lng);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update marker position
  const updateMarker = (lat: number, lng: number) => {
    if (!mapRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
    }

    // Create custom icon
    const customIcon = L.divIcon({
      html: `
        <div style="
          background-color: #ef4444;
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 12px;
            height: 12px;
            background-color: white;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      className: "",
    });

    // Add new marker
    const marker = L.marker([lat, lng], { icon: customIcon })
      .addTo(mapRef.current)
      .bindPopup(
        `<div style="font-family: system-ui; padding: 4px;">
          <strong>Selected Location</strong><br/>
          <span style="font-size: 12px;">
            Lat: ${lat.toFixed(6)}<br/>
            Lng: ${lng.toFixed(6)}
          </span>
        </div>`,
      )
      .openPopup();

    markerRef.current = marker;

    // Center map on marker
    mapRef.current.setView([lat, lng], mapRef.current.getZoom());
  };

  // Update map view and marker when coordinates change
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      updateMarker(lat, lng);
      mapRef.current.setView([lat, lng], 15);
    }
  }, [latitude, longitude, mapReady]);

  // Get user's current location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        onLocationSelect(lat, lng);
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 16);
        }
      },
      (error) => {
        alert(`Location error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  return (
    <div className="relative">
      {/* Map Container */}
      <div
        id="location-picker-map"
        style={{ height }}
        className="w-full rounded-lg border-2 border-[#1F2937] overflow-hidden"
      />

      {/* Instructions Overlay */}
      <div className="absolute top-2 left-2 right-2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm z-[1000] pointer-events-none">
        <p className="font-semibold">
          📍 Click anywhere on the map to select location
        </p>
      </div>

      {/* My Location Button */}
      <button
        type="button"
        onClick={handleUseMyLocation}
        className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-lg z-[1000] flex items-center gap-2 font-medium transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Use My Location
      </button>

      {/* Coordinates Display */}
      {latitude && longitude && (
        <div className="mt-2 text-xs text-gray-400">
          Selected: {parseFloat(latitude).toFixed(6)},{" "}
          {parseFloat(longitude).toFixed(6)}
        </div>
      )}
    </div>
  );
}
