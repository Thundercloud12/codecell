'use client'

import { useEffect, useRef, useState } from 'react'

interface SimpleWorkerNavProps {
  workerLocation: {
    latitude: number
    longitude: number
  }
  potholeLocation: {
    latitude: number
    longitude: number
  }
}

export default function SimpleWorkerNav({ workerLocation, potholeLocation }: SimpleWorkerNavProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [distance, setDistance] = useState<number | null>(null)

  useEffect(() => {
    async function initMap() {
      if (!mapContainerRef.current) return

      const L = await import('leaflet')
      const Leaflet = L.default || L

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }

      const centerLat = (workerLocation.latitude + potholeLocation.latitude) / 2
      const centerLng = (workerLocation.longitude + potholeLocation.longitude) / 2

      const map = Leaflet.map(mapContainerRef.current).setView([centerLat, centerLng], 14)
      mapInstanceRef.current = map

      Leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors, © CARTO',
      }).addTo(map)

      // Worker marker
      const workerIcon = Leaflet.divIcon({
        html: '<div style="background:#00E676;width:30px;height:30px;border-radius:50%;border:2px solid black;box-shadow:0 0 15px #00E676;display:flex;align-items:center;justify-content:center;color:black;font-weight:bold;font-size:14px;">W</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      Leaflet.marker([workerLocation.latitude, workerLocation.longitude], { icon: workerIcon })
        .addTo(map)
        .bindPopup('<strong style="color:black">UNIT LOCATION</strong>')

      // Pothole marker
      const potholeIcon = Leaflet.divIcon({
        html: '<div style="background:#FF1744;width:30px;height:30px;border-radius:50%;border:2px solid black;box-shadow:0 0 15px #FF1744;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:14px;">!</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      Leaflet.marker([potholeLocation.latitude, potholeLocation.longitude], { icon: potholeIcon })
        .addTo(map)
        .bindPopup('<strong style="color:black">TARGET OBJECTIVE</strong>')

      // Route line
      Leaflet.polyline(
        [
          [workerLocation.latitude, workerLocation.longitude],
          [potholeLocation.latitude, potholeLocation.longitude],
        ],
        { color: '#00B8D4', weight: 4, dashArray: '10,10', opacity: 0.8 }
      ).addTo(map)

      // Calculate distance
      const R = 6371
      const dLat = ((potholeLocation.latitude - workerLocation.latitude) * Math.PI) / 180
      const dLon = ((potholeLocation.longitude - workerLocation.longitude) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((workerLocation.latitude * Math.PI) / 180) *
          Math.cos((potholeLocation.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const dist = R * c
      setDistance(dist)

      map.fitBounds(
        [
          [workerLocation.latitude, workerLocation.longitude],
          [potholeLocation.latitude, potholeLocation.longitude],
        ],
        { padding: [50, 50] }
      )
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [workerLocation, potholeLocation])

  return (
    <div className="space-y-3">
      {distance && (
        <div className="bg-[#00B8D4]/10 border border-[#00B8D4]/30 rounded-lg p-3 text-center text-xs font-mono text-[#00B8D4]">
          <span className="animate-pulse">📏 DISTANCE: {distance.toFixed(2)} km</span>
          <span className="mx-2">|</span>
          <span>⏱️ EST. TIME: {Math.ceil(distance * 12)} MIN</span>
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-96 rounded-lg border border-[#1F2937] overflow-hidden bg-black" />

      <div className="flex gap-2">
        <a
          href={`https://www.google.com/maps/dir/${workerLocation.latitude},${workerLocation.longitude}/${potholeLocation.latitude},${potholeLocation.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#00E676] text-black border border-[#00E676] px-4 py-3 rounded text-center hover:bg-[#00E676]/80 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          🗺️ OPEN_GOOGLE_NAV
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${potholeLocation.latitude},${potholeLocation.longitude}`)
            alert('COORDS_COPIED_TO_CLIPBOARD')
          }}
          className="px-4 py-3 bg-[#1F2937] text-white border border-[#374151] rounded hover:border-white text-xs font-bold uppercase tracking-wider"
        >
          📋 COPY
        </button>
      </div>
    </div>
  )
}
