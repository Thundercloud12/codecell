"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Types
interface MapLayers {
  structures: boolean;
  sensors: boolean;
  heatmap: boolean;
  anomalies: boolean;
  mlAnomalies: boolean;
  failures: boolean;
  maintenance: boolean;
  potholes: boolean;
  tickets: boolean;
  predictions: boolean;
  weather: boolean;
}

interface SmartInfraMapProps {
  data: {
    structures: any[];
    sensors: any[];
    telemetry: any[];
    anomalies: any[];
    mlAnomalies: any[];
    potholes: any[];
    tickets: any[];
    maintenance: any[];
    failures: any[];
    predictions: any[];
    heatmap: any[];
    weather: any;
  };
  visibleLayers: MapLayers;
  onItemSelect?: (item: any) => void;
}

// Color schemes for different layers
const LAYER_COLORS = {
  structures: {
    LOW: "#10B981",
    MEDIUM: "#F59E0B",
    HIGH: "#EF4444",
    CRITICAL: "#DC2626",
  },
  sensors: {
    ACTIVE: "#10B981",
    WARNING: "#F59E0B",
    STALE: "#EF4444",
    INACTIVE: "#6B7280",
    UNKNOWN: "#9CA3AF",
  },
  anomalies: {
    LOW: "#F59E0B",
    MEDIUM: "#F97316",
    HIGH: "#EF4444",
    CRITICAL: "#DC2626",
  },
  potholes: {
    LOW: "#10B981",
    MEDIUM: "#F59E0B",
    HIGH: "#F97316",
    CRITICAL: "#EF4444",
  },
  tickets: {
    DETECTED: "#6B7280",
    RANKED: "#8B5CF6",
    ASSIGNED: "#3B82F6",
    IN_PROGRESS: "#F59E0B",
    AWAITING_VERIFICATION: "#EC4899",
    RESOLVED: "#10B981",
    REJECTED: "#EF4444",
  },
  predictions: {
    LOW: "#10B981",
    MEDIUM: "#F59E0B",
    HIGH: "#F97316",
    CRITICAL: "#EF4444",
  },
};

// Create custom icon
function createIcon(color: string, size: number = 12, shape: "circle" | "square" | "triangle" = "circle") {
  const svgContent = shape === "circle"
    ? `<circle cx="${size}" cy="${size}" r="${size - 2}" fill="${color}" stroke="white" stroke-width="2"/>`
    : shape === "square"
    ? `<rect x="2" y="2" width="${size * 2 - 4}" height="${size * 2 - 4}" fill="${color}" stroke="white" stroke-width="2"/>`
    : `<polygon points="${size},2 ${size * 2 - 2},${size * 2 - 2} 2,${size * 2 - 2}" fill="${color}" stroke="white" stroke-width="2"/>`;

  return L.divIcon({
    html: `<svg width="${size * 2}" height="${size * 2}" viewBox="0 0 ${size * 2} ${size * 2}">${svgContent}</svg>`,
    className: "custom-marker",
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
  });
}

// Create popup content
function createPopup(type: string, data: any): string {
  const styles = `
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 12px;
    max-width: 280px;
  `;

  switch (type) {
    case "structure":
      return `
        <div style="${styles}">
          <h3 style="margin: 0 0 8px; font-size: 14px; color: #1E3A5F;">${data.name || "Structure"}</h3>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Type:</strong> ${data.structureType}</p>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Risk:</strong> <span style="color: ${LAYER_COLORS.structures[data.failureRisk as keyof typeof LAYER_COLORS.structures] || "#6B7280"}">${data.failureRisk}</span></p>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Risk Score:</strong> ${(data.riskScore * 100).toFixed(1)}%</p>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Condition:</strong> ${(data.conditionScore * 100).toFixed(1)}%</p>
          ${data.zone ? `<p style="margin: 4px 0; color: #5A6C7D;"><strong>Zone:</strong> ${data.zone}</p>` : ""}
        </div>
      `;

    case "sensor":
      return `
        <div style="${styles}">
          <h3 style="margin: 0 0 8px; font-size: 14px; color: #1E3A5F;">Sensor ${data.sensorCode}</h3>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Type:</strong> ${data.sensorType}</p>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Status:</strong> <span style="color: ${LAYER_COLORS.sensors[data.status as keyof typeof LAYER_COLORS.sensors] || "#6B7280"}">${data.status}</span></p>
          ${data.lastHeartbeat ? `<p style="margin: 4px 0; color: #5A6C7D;"><strong>Last Heartbeat:</strong> ${new Date(data.lastHeartbeat).toLocaleString()}</p>` : ""}
        </div>
      `;

    case "anomaly":
      return `
        <div style="${styles}">
          <h3 style="margin: 0 0 8px; font-size: 14px; color: #EF4444;">⚠️ Anomaly Detected</h3>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Type:</strong> ${data.anomalyType}</p>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Severity:</strong> <span style="color: ${LAYER_COLORS.anomalies[data.severity as keyof typeof LAYER_COLORS.anomalies] || "#6B7280"}">${data.severity}</span></p>
          ${data.value ? `<p style="margin: 4px 0; color: #5A6C7D;"><strong>Value:</strong> ${data.value}</p>` : ""}
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Detected:</strong> ${new Date(data.detectedAt).toLocaleString()}</p>
        </div>
      `;

    case "mlAnomaly":
      return `
        <div style="${styles}">
          <h3 style="margin: 0 0 8px; font-size: 14px; color: #8B5CF6;">🧠 ML Anomaly</h3>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Reading:</strong> ${data.readingType}</p>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Value:</strong> ${data.value}</p>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Score:</strong> ${(data.anomalyScore * 100).toFixed(1)}%</p>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Model:</strong> ${data.modelVersion}</p>
        </div>
      `;

    case "pothole":
      return `
        <div style="${styles}">
          <h3 style="margin: 0 0 8px; font-size: 14px; color: #F97316;">🕳️ Pothole</h3>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Priority:</strong> <span style="color: ${LAYER_COLORS.potholes[data.priority as keyof typeof LAYER_COLORS.potholes] || "#6B7280"}">${data.priority}</span></p>
          ${data.priorityScore ? `<p style="margin: 4px 0; color: #5A6C7D;"><strong>Score:</strong> ${data.priorityScore.toFixed(2)}</p>` : ""}
          ${data.roadName ? `<p style="margin: 4px 0; color: #5A6C7D;"><strong>Road:</strong> ${data.roadName}</p>` : ""}
          ${data.ticketNumber ? `<p style="margin: 4px 0; color: #5A6C7D;"><strong>Ticket:</strong> ${data.ticketNumber} (${data.ticketStatus})</p>` : ""}
        </div>
      `;

    case "ticket":
      return `
        <div style="${styles}">
          <h3 style="margin: 0 0 8px; font-size: 14px; color: #06B6D4;">🎫 Ticket ${data.ticketNumber}</h3>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Status:</strong> <span style="color: ${LAYER_COLORS.tickets[data.status as keyof typeof LAYER_COLORS.tickets] || "#6B7280"}">${data.status}</span></p>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Potholes:</strong> ${data.potholeCount}</p>
          ${data.assignedWorker ? `<p style="margin: 4px 0; color: #5A6C7D;"><strong>Worker:</strong> ${data.assignedWorker}</p>` : ""}
          ${data.eta ? `<p style="margin: 4px 0; color: #5A6C7D;"><strong>ETA:</strong> ${new Date(data.eta).toLocaleString()}</p>` : ""}
        </div>
      `;

    case "maintenance":
      return `
        <div style="${styles}">
          <h3 style="margin: 0 0 8px; font-size: 14px; color: #6366F1;">🔧 Maintenance</h3>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Type:</strong> ${data.logType}</p>
          ${data.description ? `<p style="margin: 4px 0; color: #5A6C7D;"><strong>Description:</strong> ${data.description}</p>` : ""}
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Performed:</strong> ${new Date(data.performedAt).toLocaleString()}</p>
          ${data.structureName ? `<p style="margin: 4px 0; color: #5A6C7D;"><strong>Structure:</strong> ${data.structureName}</p>` : ""}
        </div>
      `;

    case "failure":
      return `
        <div style="${styles}">
          <h3 style="margin: 0 0 8px; font-size: 14px; color: #DC2626;">⚡ Failure Event</h3>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Type:</strong> ${data.failureType}</p>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Severity:</strong> <span style="color: ${LAYER_COLORS.anomalies[data.severity as keyof typeof LAYER_COLORS.anomalies] || "#6B7280"}">${data.severity}</span></p>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Occurred:</strong> ${new Date(data.occurredAt).toLocaleString()}</p>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Status:</strong> ${data.isResolved ? "✅ Resolved" : "⏳ Unresolved"}</p>
        </div>
      `;

    case "prediction":
      return `
        <div style="${styles}">
          <h3 style="margin: 0 0 8px; font-size: 14px; color: #EC4899;">📊 ML Prediction</h3>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Risk:</strong> <span style="color: ${LAYER_COLORS.predictions[data.failureRisk as keyof typeof LAYER_COLORS.predictions] || "#6B7280"}">${data.failureRisk}</span></p>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>Probability:</strong> ${(data.failureProbability * 100).toFixed(1)}%</p>
          <p style="margin: 4px 0; color: #5A6C7D;"><strong>24h Alert:</strong> ${data.predictedWithin24h ? "⚠️ Yes" : "No"}</p>
          ${data.structureName ? `<p style="margin: 4px 0; color: #5A6C7D;"><strong>Structure:</strong> ${data.structureName}</p>` : ""}
        </div>
      `;

    default:
      return `<div style="${styles}"><pre>${JSON.stringify(data, null, 2)}</pre></div>`;
  }
}

export default function SmartInfraMap({ data, visibleLayers, onItemSelect }: SmartInfraMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});
  const heatLayerRef = useRef<any>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map
    const map = L.map(mapContainerRef.current, {
      center: [19.076, 72.8777], // Mumbai default
      zoom: 12,
      zoomControl: false,
    });

    // Add dark tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control to top-right
    L.control.zoom({ position: "topright" }).addTo(map);

    // Initialize layer groups
    const layerNames = [
      "structures",
      "sensors",
      "anomalies",
      "mlAnomalies",
      "potholes",
      "tickets",
      "maintenance",
      "failures",
      "predictions",
    ];

    layerNames.forEach((name) => {
      layerGroupsRef.current[name] = L.layerGroup().addTo(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update layers when data or visibility changes
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Clear all layers first
    Object.values(layerGroupsRef.current).forEach((group) => group.clearLayers());

    // Remove heatmap if exists
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    // Add structures
    if (visibleLayers.structures && data.structures?.length) {
      data.structures.forEach((s) => {
        if (!s.lat || !s.lng) return;
        const color = LAYER_COLORS.structures[s.failureRisk as keyof typeof LAYER_COLORS.structures] || "#3B82F6";
        const marker = L.marker([s.lat, s.lng], { icon: createIcon(color, 14, "square") })
          .bindPopup(createPopup("structure", s))
          .on("click", () => onItemSelect?.(s));
        layerGroupsRef.current.structures.addLayer(marker);
      });
    }

    // Add sensors
    if (visibleLayers.sensors && data.sensors?.length) {
      data.sensors.forEach((s) => {
        if (!s.lat || !s.lng) return;
        const color = LAYER_COLORS.sensors[s.status as keyof typeof LAYER_COLORS.sensors] || "#10B981";
        const marker = L.marker([s.lat, s.lng], { icon: createIcon(color, 10, "circle") })
          .bindPopup(createPopup("sensor", s))
          .on("click", () => onItemSelect?.(s));
        layerGroupsRef.current.sensors.addLayer(marker);
      });
    }

    // Add heatmap
    if (visibleLayers.heatmap && data.heatmap?.length) {
      const heatData = data.heatmap.map((h) => [h.lat, h.lng, h.intensity]);
      // @ts-expect-error - leaflet.heat types not fully typed
      heatLayerRef.current = L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.0: "#10B981",
          0.5: "#F59E0B",
          1.0: "#EF4444",
        },
      }).addTo(map);
    }

    // Add anomalies
    if (visibleLayers.anomalies && data.anomalies?.length) {
      data.anomalies.forEach((a) => {
        if (!a.lat || !a.lng) return;
        const color = LAYER_COLORS.anomalies[a.severity as keyof typeof LAYER_COLORS.anomalies] || "#EF4444";
        const marker = L.marker([a.lat, a.lng], { icon: createIcon(color, 12, "triangle") })
          .bindPopup(createPopup("anomaly", a))
          .on("click", () => onItemSelect?.(a));
        layerGroupsRef.current.anomalies.addLayer(marker);
      });
    }

    // Add ML anomalies
    if (visibleLayers.mlAnomalies && data.mlAnomalies?.length) {
      data.mlAnomalies.forEach((a) => {
        if (!a.lat || !a.lng) return;
        const marker = L.marker([a.lat, a.lng], { icon: createIcon("#8B5CF6", 10, "circle") })
          .bindPopup(createPopup("mlAnomaly", a))
          .on("click", () => onItemSelect?.(a));
        layerGroupsRef.current.mlAnomalies.addLayer(marker);
      });
    }

    // Add potholes
    if (visibleLayers.potholes && data.potholes?.length) {
      data.potholes.forEach((p) => {
        if (!p.lat || !p.lng) return;
        const color = LAYER_COLORS.potholes[p.priority as keyof typeof LAYER_COLORS.potholes] || "#F97316";
        const marker = L.marker([p.lat, p.lng], { icon: createIcon(color, 10, "circle") })
          .bindPopup(createPopup("pothole", p))
          .on("click", () => onItemSelect?.(p));
        layerGroupsRef.current.potholes.addLayer(marker);
      });
    }

    // Add tickets (use first pothole location or skip)
    if (visibleLayers.tickets && data.tickets?.length) {
      // We'd need pothole locations for tickets - skip for now or use a default
    }

    // Add maintenance logs
    if (visibleLayers.maintenance && data.maintenance?.length) {
      data.maintenance.forEach((m) => {
        if (!m.lat || !m.lng) return;
        const marker = L.marker([m.lat, m.lng], { icon: createIcon("#6366F1", 10, "square") })
          .bindPopup(createPopup("maintenance", m))
          .on("click", () => onItemSelect?.(m));
        layerGroupsRef.current.maintenance.addLayer(marker);
      });
    }

    // Add failures
    if (visibleLayers.failures && data.failures?.length) {
      data.failures.forEach((f) => {
        if (!f.lat || !f.lng) return;
        const color = f.isResolved ? "#10B981" : "#DC2626";
        const marker = L.marker([f.lat, f.lng], { icon: createIcon(color, 12, "triangle") })
          .bindPopup(createPopup("failure", f))
          .on("click", () => onItemSelect?.(f));
        layerGroupsRef.current.failures.addLayer(marker);
      });
    }

    // Add predictions
    if (visibleLayers.predictions && data.predictions?.length) {
      data.predictions.forEach((p) => {
        if (!p.lat || !p.lng) return;
        const color = LAYER_COLORS.predictions[p.failureRisk as keyof typeof LAYER_COLORS.predictions] || "#EC4899";
        // Use a pulsing circle for predictions
        const marker = L.circleMarker([p.lat, p.lng], {
          radius: p.predictedWithin24h ? 15 : 10,
          color: color,
          fillColor: color,
          fillOpacity: 0.3,
          weight: 2,
        })
          .bindPopup(createPopup("prediction", p))
          .on("click", () => onItemSelect?.(p));
        layerGroupsRef.current.predictions.addLayer(marker);
      });
    }

    // Fit bounds to show all data
    const allCoords: [number, number][] = [];
    
    if (visibleLayers.structures) {
      data.structures?.forEach((s) => s.lat && s.lng && allCoords.push([s.lat, s.lng]));
    }
    if (visibleLayers.sensors) {
      data.sensors?.forEach((s) => s.lat && s.lng && allCoords.push([s.lat, s.lng]));
    }
    if (visibleLayers.potholes) {
      data.potholes?.forEach((p) => p.lat && p.lng && allCoords.push([p.lat, p.lng]));
    }

    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [data, visibleLayers, onItemSelect]);

  return (
    <div
      ref={mapContainerRef}
      className="h-full w-full"
      style={{ background: "#0B1220" }}
    />
  );
}
