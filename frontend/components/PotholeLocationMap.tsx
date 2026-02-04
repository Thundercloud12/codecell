'use client'

import { useEffect, useState, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

interface PotholeLocationMapProps {
  latitude: number
  longitude: number
  confidence?: number
}

export default function PotholeLocationMap({ 
  latitude, 
  longitude, 
  confidence 
}: PotholeLocationMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    const initializeMap = async () => {
      try {
        console.log('🗺️ Starting map initialization with coordinates:', { latitude, longitude })
        
        // Validate coordinates
        if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
          throw new Error('Invalid coordinates provided')
        }

        if (!mapContainerRef.current) {
          throw new Error('Map container ref not available')
        }

        // Clean up any existing map first
        if (mapRef.current) {
          console.log('🧹 Cleaning up existing map')
          mapRef.current.remove()
          mapRef.current = null
        }

        // Dynamic import of Leaflet
        console.log('📦 Loading Leaflet library...')
        const L = (await import('leaflet')).default

        if (!L || !L.map) {
          throw new Error('Leaflet library not loaded properly')
        }

        console.log('✅ Leaflet loaded successfully')

        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })

        if (!isMounted) return

        // Initialize the map
        console.log('🗺️ Creating map instance...')
        const mapInstance = L.map(mapContainerRef.current, {
          center: [latitude, longitude],
          zoom: 17,
          zoomControl: true,
          attributionControl: true
        })

        mapRef.current = mapInstance

        // Add OpenStreetMap tiles
        console.log('🌍 Adding map tiles...')
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(mapInstance)

        // Create custom red icon for pothole
        const potholeIcon = L.divIcon({
          html: `
            <div style="
              background-color: #dc2626;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 12px;
            ">
              🕳️
            </div>
          `,
          className: 'pothole-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })

        // Add pothole marker
        console.log('📍 Adding marker...')
        const marker = L.marker([latitude, longitude], { icon: potholeIcon }).addTo(mapInstance)
        
        // Add popup with details
        const popupContent = `
          <div style="text-align: center; min-width: 150px;">
            <strong style="color: #dc2626;">🕳️ Pothole Location</strong><br/><br/>
            <div style="font-size: 12px; color: #666;">
              <strong>Coordinates:</strong><br/>
              Lat: ${latitude.toFixed(6)}<br/>
              Lng: ${longitude.toFixed(6)}
            </div>
            ${confidence ? `<br/><div style="color: #dc2626; font-weight: bold;">AI Confidence: ${(confidence * 100).toFixed(1)}%</div>` : ''}
          </div>
        `
        
        marker.bindPopup(popupContent)

        // Force map to refresh
        setTimeout(() => {
          if (mapRef.current && isMounted) {
            mapRef.current.invalidateSize()
          }
        }, 100)

        if (isMounted) {
          setMapLoaded(true)
          console.log('✅ Map initialized successfully')
        }

      } catch (error) {
        console.error('❌ Map initialization failed:', error)
        if (isMounted) {
          setMapError(error instanceof Error ? error.message : 'Failed to load map')
        }
      }
    }

    initializeMap()

    // Cleanup function
    return () => {
      isMounted = false
      if (mapRef.current) {
        console.log('🧹 Cleaning up map on unmount')
        try {
          mapRef.current.remove()
          mapRef.current = null
        } catch (e) {
          console.warn('Map cleanup warning:', e)
        }
      }
    }
  }, [latitude, longitude, confidence])

  if (mapError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 text-sm font-medium">⚠️ Map Error</p>
        <p className="text-red-500 text-xs mt-1">{mapError}</p>
        <p className="text-gray-500 text-xs mt-2">
          Coordinates: {latitude}, {longitude}
        </p>
      </div>
    )
  }

  return (
    <div className="relative bg-white rounded-lg border border-gray-300 overflow-hidden" style={{ zIndex: 1 }}>
      <div 
        ref={mapContainerRef}
        className="h-64 w-full"
        style={{ minHeight: '256px', zIndex: 1 }}
      />
      
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading interactive map...</p>
          </div>
        </div>
      )}

      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>📍 {latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
          <span>🔍 Zoom: 17 | 🗺️ OpenStreetMap</span>
        </div>
      </div>
    </div>
  )
}