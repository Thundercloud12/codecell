"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Activity,
  Radio,
  AlertTriangle,
  Brain,
  Wrench,
  MapPin,
  Ticket,
  TrendingUp,
  Cloud,
  Thermometer,
  RefreshCw,
  Layers,
  X,
  Zap,
} from "lucide-react";

// Dynamic import for map (avoid SSR issues with Leaflet)
const SmartInfraMap = dynamic(() => import("@/components/SmartInfraMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#0B1220]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00E676] border-t-transparent mx-auto mb-4" />
        <p className="text-[#94A3B8]">Loading map...</p>
      </div>
    </div>
  ),
});

// Types
interface LayerToggle {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  count?: number;
}

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

interface MapData {
  layers: {
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
  summary: {
    totalStructures: number;
    totalSensors: number;
    activeSensors: number;
    totalAnomalies: number;
    unresolvedAnomalies: number;
    mlAnomalies: number;
    totalPotholes: number;
    criticalPotholes: number;
    totalTickets: number;
    pendingTickets: number;
    maintenanceLogs: number;
    failureEvents: number;
    unresolvedFailures: number;
    highRiskStructures: number;
    predictions24h: number;
  };
  generatedAt: string;
}

export default function SmartInfrastructureMapPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Layer visibility state
  const [layers, setLayers] = useState<MapLayers>({
    structures: true,
    sensors: true,
    heatmap: false,
    anomalies: true,
    mlAnomalies: false,
    failures: true,
    maintenance: false,
    potholes: true,
    tickets: true,
    predictions: true,
    weather: true,
  });

  // Data state
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Fetch map data
  const fetchMapData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/smart-map?limit=500");
      const data = await res.json();

      if (data.success) {
        setMapData(data);
        setLastRefresh(new Date());
        setError(null);
      } else {
        setError(data.error || "Failed to fetch map data");
      }
    } catch (err) {
      console.error("Error fetching map data:", err);
      setError("Network error - please try again");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and auto-refresh
  useEffect(() => {
    fetchMapData();

    if (autoRefresh) {
      const interval = setInterval(fetchMapData, 30000); // 30 second refresh
      return () => clearInterval(interval);
    }
  }, [fetchMapData, autoRefresh]);

  // Check user role
  useEffect(() => {
    if (isLoaded && user) {
      const role = (user.publicMetadata?.role as string)?.toLowerCase();
      if (role !== "admin") {
        router.push("/");
      }
    }
  }, [isLoaded, user, router]);

  // Toggle layer visibility
  const toggleLayer = (layerId: keyof MapLayers) => {
    setLayers((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  // Layer toggle definitions
  const layerToggles: LayerToggle[] = [
    {
      id: "structures",
      label: "Structures",
      icon: <Activity className="w-4 h-4" />,
      color: "#3B82F6",
      count: mapData?.summary.totalStructures,
    },
    {
      id: "sensors",
      label: "IoT Sensors",
      icon: <Radio className="w-4 h-4" />,
      color: "#10B981",
      count: mapData?.summary.totalSensors,
    },
    {
      id: "heatmap",
      label: "Telemetry Heatmap",
      icon: <Thermometer className="w-4 h-4" />,
      color: "#F59E0B",
    },
    {
      id: "anomalies",
      label: "Utility Anomalies",
      icon: <AlertTriangle className="w-4 h-4" />,
      color: "#EF4444",
      count: mapData?.summary.unresolvedAnomalies,
    },
    {
      id: "mlAnomalies",
      label: "ML Anomalies",
      icon: <Brain className="w-4 h-4" />,
      color: "#8B5CF6",
      count: mapData?.summary.mlAnomalies,
    },
    {
      id: "failures",
      label: "Failure Events",
      icon: <Zap className="w-4 h-4" />,
      color: "#DC2626",
      count: mapData?.summary.unresolvedFailures,
    },
    {
      id: "maintenance",
      label: "Maintenance Logs",
      icon: <Wrench className="w-4 h-4" />,
      color: "#6366F1",
      count: mapData?.summary.maintenanceLogs,
    },
    {
      id: "potholes",
      label: "Potholes",
      icon: <MapPin className="w-4 h-4" />,
      color: "#F97316",
      count: mapData?.summary.totalPotholes,
    },
    {
      id: "tickets",
      label: "Tickets",
      icon: <Ticket className="w-4 h-4" />,
      color: "#06B6D4",
      count: mapData?.summary.pendingTickets,
    },
    {
      id: "predictions",
      label: "ML Predictions",
      icon: <TrendingUp className="w-4 h-4" />,
      color: "#EC4899",
      count: mapData?.summary.predictions24h,
    },
    {
      id: "weather",
      label: "Weather Overlay",
      icon: <Cloud className="w-4 h-4" />,
      color: "#0EA5E9",
    },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#050B16] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00E676] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#050B16] text-white overflow-hidden flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 bg-[#0B1220] border-r border-[#1F2937] flex flex-col overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#1F2937] flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-[#00E676] flex items-center gap-2">
              <Layers className="w-6 h-6" />
              Smart Infra Map
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-[#1F2937] rounded"
            >
              <X className="w-5 h-5 text-[#94A3B8]" />
            </button>
          </div>

          {/* Refresh Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchMapData}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1F2937] hover:bg-[#374151] rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                autoRefresh
                  ? "bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/50"
                  : "bg-[#1F2937] text-[#94A3B8]"
              }`}
            >
              Auto
            </button>
          </div>

          {lastRefresh && (
            <p className="text-xs text-[#94A3B8] mt-2">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Layer Toggles */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-sm font-semibold text-[#94A3B8] mb-3 uppercase tracking-wider">
            Map Layers
          </h2>
          <div className="space-y-2">
            {layerToggles.map((toggle) => (
              <button
                key={toggle.id}
                onClick={() => toggleLayer(toggle.id as keyof MapLayers)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                  layers[toggle.id as keyof MapLayers]
                    ? "bg-[#1F2937] border border-[#374151]"
                    : "bg-transparent border border-transparent hover:bg-[#1F2937]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      layers[toggle.id as keyof MapLayers]
                        ? "opacity-100"
                        : "opacity-40"
                    }`}
                    style={{
                      backgroundColor: `${toggle.color}20`,
                      color: toggle.color,
                    }}
                  >
                    {toggle.icon}
                  </div>
                  <span
                    className={`text-sm ${
                      layers[toggle.id as keyof MapLayers]
                        ? "text-white"
                        : "text-[#94A3B8]"
                    }`}
                  >
                    {toggle.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {toggle.count !== undefined && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${toggle.color}20`,
                        color: toggle.color,
                      }}
                    >
                      {toggle.count}
                    </span>
                  )}
                  <div
                    className={`w-4 h-4 rounded border-2 transition-colors ${
                      layers[toggle.id as keyof MapLayers]
                        ? "bg-[#00E676] border-[#00E676]"
                        : "border-[#374151]"
                    }`}
                  >
                    {layers[toggle.id as keyof MapLayers] && (
                      <svg
                        className="w-full h-full text-[#050B16]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        {mapData && (
          <div className="p-4 border-t border-[#1F2937] flex-shrink-0">
            <h2 className="text-sm font-semibold text-[#94A3B8] mb-3 uppercase tracking-wider">
              Summary
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#1F2937] rounded-lg p-2">
                <p className="text-[#94A3B8]">High Risk</p>
                <p className="text-xl font-bold text-[#EF4444]">
                  {mapData.summary.highRiskStructures}
                </p>
              </div>
              <div className="bg-[#1F2937] rounded-lg p-2">
                <p className="text-[#94A3B8]">Critical</p>
                <p className="text-xl font-bold text-[#F97316]">
                  {mapData.summary.criticalPotholes}
                </p>
              </div>
              <div className="bg-[#1F2937] rounded-lg p-2">
                <p className="text-[#94A3B8]">24h Alerts</p>
                <p className="text-xl font-bold text-[#EC4899]">
                  {mapData.summary.predictions24h}
                </p>
              </div>
              <div className="bg-[#1F2937] rounded-lg p-2">
                <p className="text-[#94A3B8]">Pending</p>
                <p className="text-xl font-bold text-[#06B6D4]">
                  {mapData.summary.pendingTickets}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Weather Widget */}
        {mapData?.layers.weather && layers.weather && (
          <div className="p-4 border-t border-[#1F2937] flex-shrink-0">
            <h2 className="text-sm font-semibold text-[#94A3B8] mb-3 uppercase tracking-wider">
              Weather
            </h2>
            <div className="bg-gradient-to-br from-[#0EA5E9]/20 to-[#06B6D4]/20 rounded-lg p-3 border border-[#0EA5E9]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{mapData.layers.weather.city}</p>
                  <p className="text-2xl font-bold text-[#0EA5E9]">
                    {mapData.layers.weather.temperature}°C
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#94A3B8]">
                    {mapData.layers.weather.condition}
                  </p>
                  <p className={`text-sm font-semibold ${
                    mapData.layers.weather.floodRisk === "HIGH" || mapData.layers.weather.floodRisk === "CRITICAL"
                      ? "text-[#EF4444]"
                      : mapData.layers.weather.floodRisk === "MEDIUM"
                      ? "text-[#F59E0B]"
                      : "text-[#10B981]"
                  }`}>
                    Flood: {mapData.layers.weather.floodRisk}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        {/* Toggle Sidebar Button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-[1000] bg-[#0B1220] border border-[#1F2937] rounded-lg p-3 hover:bg-[#1F2937] transition-colors"
          >
            <Layers className="w-5 h-5 text-[#00E676]" />
          </button>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-[#DC2626]/20 border border-[#DC2626] rounded-lg px-4 py-2 text-[#DC2626] text-sm">
            {error}
          </div>
        )}

        {/* Map */}
        {mapData ? (
          <SmartInfraMap
            data={mapData.layers}
            visibleLayers={layers}
            onItemSelect={setSelectedItem}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-[#0B1220]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00E676] border-t-transparent mx-auto mb-4" />
              <p className="text-[#94A3B8]">Loading infrastructure data...</p>
            </div>
          </div>
        )}

        {/* Selected Item Panel */}
        {selectedItem && (
          <div className="absolute bottom-4 right-4 z-[1000] w-80 bg-[#0B1220] border border-[#1F2937] rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#1F2937] flex items-center justify-between">
              <h3 className="font-semibold text-white">Details</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 hover:bg-[#1F2937] rounded"
              >
                <X className="w-4 h-4 text-[#94A3B8]" />
              </button>
            </div>
            <div className="p-4 max-h-60 overflow-y-auto">
              <pre className="text-xs text-[#94A3B8] whitespace-pre-wrap">
                {JSON.stringify(selectedItem, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
