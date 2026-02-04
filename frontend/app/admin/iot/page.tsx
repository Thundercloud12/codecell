"use client";

import { useEffect, useState, useCallback } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  Zap,
  Droplets,
  Thermometer,
  Gauge,
  Radio,
  RefreshCw,
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface TelemetryData {
  id: string;
  timestamp: string;
  readingType: string;
  value: number;
  unit: string;
  sensor: {
    sensorCode: string;
    sensorType: string;
    structure: {
      name: string;
      structureType: string;
    };
  };
}

interface Anomaly {
  id: string;
  anomalyType: string;
  severity: string;
  detectedValue: number;
  expectedRange: string;
  detectedAt: string;
  sensor: {
    sensorCode: string;
    sensorType: string;
  };
}

interface SensorInfo {
  id: string;
  sensorCode: string;
  sensorType: string;
  isActive: boolean;
  lastHeartbeat: string | null;
  structure: {
    name: string;
    structureType: string;
  };
  telemetry: { value: number; unit: string; timestamp: string }[];
}

interface Stats {
  totalReadings: number;
  activeSensors: number;
  totalAnomalies: number;
  criticalAnomalies: number;
}

interface MLAnomaly {
  id: string;
  readingType: string;
  value: number;
  isAnomaly: boolean;
  anomalyScore: number;
  modelVersion: string;
  detectedAt: string;
  sensor: {
    sensorCode: string;
    name: string;
    structure: {
      name: string;
    };
  };
}

interface MLPrediction {
  id: string;
  structureId: string;
  failureProbability: number;
  failureRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  predictedFailure24h: boolean;
  confidenceScore: number;
  contributingFactors: Record<string, number>;
  modelVersion: string;
  predictedAt: string;
  validUntil: string;
  structure: {
    name: string;
    type: string;
  };
}

interface MLStats {
  anomalyCount: number;
  avgAnomalyScore: number;
  highRiskCount: number;
  failure24hCount: number;
}

const READING_COLORS: Record<string, string> = {
  FLOW_RATE: "#00E676",
  PRESSURE: "#2196F3",
  VOLTAGE: "#FF9800",
  CURRENT: "#E91E63",
  TEMPERATURE: "#9C27B0",
  VIBRATION: "#00BCD4",
  POWER_USAGE: "#FFEB3B",
};

const SEVERITY_COLORS: Record<string, string> = {
  LOW: "#4CAF50",
  MEDIUM: "#FF9800",
  HIGH: "#F44336",
  CRITICAL: "#B71C1C",
};

export default function IoTMonitoringPage() {
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([]);
  const [sensors, setSensors] = useState<SensorInfo[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalReadings: 0,
    activeSensors: 0,
    totalAnomalies: 0,
    criticalAnomalies: 0,
  });
  const [mlAnomalies, setMlAnomalies] = useState<MLAnomaly[]>([]);
  const [mlPredictions, setMlPredictions] = useState<MLPrediction[]>([]);
  const [mlStats, setMlStats] = useState<MLStats>({
    anomalyCount: 0,
    avgAnomalyScore: 0,
    highRiskCount: 0,
    failure24hCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedReadingType, setSelectedReadingType] = useState<string>("ALL");
  const [isLive, setIsLive] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [telemetryRes, mlAnomaliesRes, mlPredictionsRes] = await Promise.all([
        fetch("/api/telemetry?hours=1&limit=500"),
        fetch("/api/ml/anomalies?hours=1&limit=100&onlyAnomalies=true"),
        fetch("/api/ml/predictions?onlyValid=true"),
      ]);

      const data = await telemetryRes.json();
      const mlAnomaliesData = await mlAnomaliesRes.json();
      const mlPredictionsData = await mlPredictionsRes.json();

      setTelemetry(data.telemetry || []);
      setSensors(data.sensors || []);
      setAnomalies(data.anomalies || []);
      setStats(data.stats || {});
      
      setMlAnomalies(mlAnomaliesData.anomalies || []);
      setMlStats({
        anomalyCount: mlAnomaliesData.stats?.anomalyCount || 0,
        avgAnomalyScore: mlAnomaliesData.stats?.avgAnomalyScore || 0,
        highRiskCount: mlPredictionsData.stats?.highRiskCount || 0,
        failure24hCount: mlPredictionsData.stats?.failure24hCount || 0,
      });
      setMlPredictions(mlPredictionsData.latestPredictions || []);
      
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time updates via SSE
  useEffect(() => {
    if (!isLive) return;

    const eventSource = new EventSource("/api/telemetry/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.telemetry?.length > 0) {
          setTelemetry((prev) => {
            const newData = [...prev, ...data.telemetry];
            // Keep last 500 readings
            return newData.slice(-500);
          });
        }

        if (data.anomalies?.length > 0) {
          setAnomalies((prev) => {
            const newData = [...data.anomalies, ...prev];
            return newData.slice(0, 20);
          });
        }

        // Handle ML anomalies
        if (data.mlAnomalies?.length > 0) {
          setMlAnomalies((prev) => {
            const newData = [...data.mlAnomalies, ...prev];
            return newData.slice(0, 100);
          });
          
          // Update ML stats
          setMlStats((prev) => ({
            ...prev,
            anomalyCount: prev.anomalyCount + data.mlAnomalies.length,
            avgAnomalyScore: data.mlAnomalies.reduce((sum: number, a: MLAnomaly) => sum + a.anomalyScore, 0) / data.mlAnomalies.length,
          }));
        }

        // Handle ML predictions
        if (data.mlPredictions?.length > 0) {
          setMlPredictions((prev) => {
            // Replace predictions for structures that have new data
            const structureIds = new Set(data.mlPredictions.map((p: MLPrediction) => p.structureId));
            const filtered = prev.filter(p => !structureIds.has(p.structureId));
            return [...data.mlPredictions, ...filtered];
          });

          // Update ML stats
          const highRisk = data.mlPredictions.filter((p: MLPrediction) => 
            p.failureRisk === 'HIGH' || p.failureRisk === 'CRITICAL'
          ).length;
          const failure24h = data.mlPredictions.filter((p: MLPrediction) => 
            p.predictedFailure24h
          ).length;

          setMlStats((prev) => ({
            ...prev,
            highRiskCount: prev.highRiskCount + highRisk,
            failure24hCount: prev.failure24hCount + failure24h,
          }));
        }
      } catch (e) {
        // Heartbeat or parse error
      }
    };

    eventSource.onerror = () => {
      console.error("SSE connection error");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [isLive]);

  // Group telemetry by reading type for charts
  const groupedByType = telemetry.reduce((acc, item) => {
    if (!acc[item.readingType]) {
      acc[item.readingType] = [];
    }
    acc[item.readingType].push({
      time: new Date(item.timestamp).toLocaleTimeString(),
      value: item.value,
      sensor: item.sensor.sensorCode,
      unit: item.unit,
    });
    return acc;
  }, {} as Record<string, any[]>);

  // Filter data based on selection
  const chartData =
    selectedReadingType === "ALL"
      ? Object.entries(groupedByType)
      : [[selectedReadingType, groupedByType[selectedReadingType] || []]];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="text-[#00E676] animate-pulse font-mono text-xl">
          CONNECTING TO SENSORS...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      {/* Header */}
      <header className="bg-[#111827]/80 backdrop-blur-lg border-b border-[#1F2937] sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
            <div className="w-px h-6 bg-[#1F2937]" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  IoT Monitoring Center
                </h1>
                <p className="text-xs text-gray-400">
                  Real-time Infrastructure Telemetry
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                isLive
                  ? "bg-green-500/20 text-green-400 border border-green-500/50"
                  : "bg-gray-500/20 text-gray-400 border border-gray-500/50"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isLive ? "bg-green-400 animate-pulse" : "bg-gray-400"
                }`}
              />
              {isLive ? "LIVE" : "PAUSED"}
            </button>
            <button
              onClick={fetchData}
              className="p-2 rounded-lg bg-[#1F2937] hover:bg-[#374151] transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="Total Readings"
            value={stats.totalReadings.toLocaleString()}
            color="cyan"
          />
          <StatCard
            icon={<Radio className="w-6 h-6" />}
            label="Active Sensors"
            value={stats.activeSensors.toString()}
            color="green"
          />
          <StatCard
            icon={<AlertTriangle className="w-6 h-6" />}
            label="Anomalies Detected"
            value={stats.totalAnomalies.toString()}
            color="orange"
          />
          <StatCard
            icon={<Zap className="w-6 h-6" />}
            label="Critical Alerts"
            value={stats.criticalAnomalies.toString()}
            color="red"
          />
        </div>

        {/* ML Insights Section */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">🤖 ML-Powered Insights</h2>
              <p className="text-xs text-gray-400">Real-time AI predictions from Isolation Forest & LSTM models</p>
            </div>
          </div>

          {/* ML Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#111827]/60 rounded-xl p-4 border border-purple-500/20">
              <p className="text-gray-400 text-sm mb-1">🔍 ML Anomalies</p>
              <p className="text-3xl font-bold font-mono text-purple-400">{mlStats.anomalyCount}</p>
              <p className="text-xs text-gray-500 mt-1">Avg Score: {mlStats.avgAnomalyScore.toFixed(3)}</p>
            </div>
            <div className="bg-[#111827]/60 rounded-xl p-4 border border-pink-500/20">
              <p className="text-gray-400 text-sm mb-1">⚠️ High Risk</p>
              <p className="text-3xl font-bold font-mono text-pink-400">{mlStats.highRiskCount}</p>
              <p className="text-xs text-gray-500 mt-1">Structures at risk</p>
            </div>
            <div className="bg-[#111827]/60 rounded-xl p-4 border border-red-500/20">
              <p className="text-gray-400 text-sm mb-1">🚨 24h Failures</p>
              <p className="text-3xl font-bold font-mono text-red-400">{mlStats.failure24hCount}</p>
              <p className="text-xs text-gray-500 mt-1">Predicted soon</p>
            </div>
            <div className="bg-[#111827]/60 rounded-xl p-4 border border-cyan-500/20">
              <p className="text-gray-400 text-sm mb-1">🔮 Predictions</p>
              <p className="text-3xl font-bold font-mono text-cyan-400">{mlPredictions.length}</p>
              <p className="text-xs text-gray-500 mt-1">Active forecasts</p>
            </div>
          </div>

          {/* ML Predictions & Anomalies Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Failure Predictions */}
            <div className="bg-[#111827]/60 rounded-xl border border-purple-500/20 p-4">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                Structure Failure Predictions (LSTM)
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {mlPredictions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">No predictions available</p>
                ) : (
                  mlPredictions.map((pred) => <MLPredictionCard key={pred.id} prediction={pred} />)
                )}
              </div>
            </div>

            {/* ML Anomalies */}
            <div className="bg-[#111827]/60 rounded-xl border border-pink-500/20 p-4">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-pink-400" />
                ML-Detected Anomalies (Isolation Forest)
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {mlAnomalies.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">No ML anomalies detected</p>
                ) : (
                  mlAnomalies.slice(0, 10).map((anomaly) => <MLAnomalyCard key={anomaly.id} anomaly={anomaly} />)
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <FilterTab
            active={selectedReadingType === "ALL"}
            onClick={() => setSelectedReadingType("ALL")}
            label="All Types"
          />
          {Object.keys(groupedByType).map((type) => (
            <FilterTab
              key={type}
              active={selectedReadingType === type}
              onClick={() => setSelectedReadingType(type)}
              label={type.replace("_", " ")}
              color={READING_COLORS[type]}
            />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {chartData.map(([type, data]) => (
            <ChartCard
              key={type}
              title={type.replace("_", " ")}
              data={data as any[]}
              color={READING_COLORS[type] || "#00E676"}
              unit={data?.[0]?.unit || ""}
            />
          ))}
        </div>

        {/* Sensors Grid & Anomalies */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sensors List */}
          <div className="lg:col-span-2 bg-[#111827] rounded-2xl border border-[#1F2937] p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              Active Sensors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sensors.map((sensor) => (
                <SensorCard key={sensor.id} sensor={sensor} />
              ))}
            </div>
          </div>

          {/* Anomalies Feed */}
          <div className="bg-[#111827] rounded-2xl border border-[#1F2937] p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Recent Anomalies
            </h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {anomalies.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No anomalies detected
                </p>
              ) : (
                anomalies.map((anomaly) => (
                  <AnomalyCard key={anomaly.id} anomaly={anomaly} />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-components
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "cyan" | "green" | "orange" | "red";
}) {
  const colors = {
    cyan: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400",
    green:
      "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400",
    orange:
      "from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold font-mono">{value}</p>
        </div>
      </div>
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
        active
          ? "bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/50"
          : "bg-[#1F2937] text-gray-400 border border-transparent hover:border-gray-600"
      }`}
      style={active && color ? { backgroundColor: `${color}20`, color, borderColor: `${color}50` } : {}}
    >
      {label}
    </button>
  );
}

function ChartCard({
  title,
  data,
  color,
  unit,
}: {
  title: string;
  data: any[];
  color: string;
  unit: string;
}) {
  return (
    <div className="bg-[#111827] rounded-2xl border border-[#1F2937] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color }}>
          {title}
        </h3>
        <span className="text-sm text-gray-400 font-mono">{unit}</span>
      </div>
      <div className="h-[250px]">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.slice(-50)}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis
                dataKey="time"
                stroke="#6B7280"
                fontSize={10}
                tickLine={false}
              />
              <YAxis stroke="#6B7280" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#9CA3AF" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${title})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}

function SensorCard({ sensor }: { sensor: SensorInfo }) {
  const latestReading = sensor.telemetry?.[0];
  const isOnline =
    sensor.lastHeartbeat &&
    new Date(sensor.lastHeartbeat) > new Date(Date.now() - 5 * 60 * 1000);

  const icons: Record<string, React.ReactNode> = {
    WATER_METER: <Droplets className="w-5 h-5 text-blue-400" />,
    PRESSURE_SENSOR: <Gauge className="w-5 h-5 text-purple-400" />,
    ENERGY_METER: <Zap className="w-5 h-5 text-yellow-400" />,
  };

  return (
    <div className="bg-[#0B1220] rounded-xl border border-[#1F2937] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {icons[sensor.sensorType] || (
            <Radio className="w-5 h-5 text-gray-400" />
          )}
          <div>
            <p className="font-mono font-bold text-sm">{sensor.sensorCode}</p>
            <p className="text-xs text-gray-500">
              {sensor.structure?.name || sensor.sensorType}
            </p>
          </div>
        </div>
        <div
          className={`w-3 h-3 rounded-full ${
            isOnline ? "bg-green-400 animate-pulse" : "bg-gray-600"
          }`}
        />
      </div>
      {latestReading && (
        <div className="bg-[#1F2937]/50 rounded-lg p-3">
          <p className="text-2xl font-mono font-bold text-white">
            {latestReading.value.toFixed(2)}
            <span className="text-sm text-gray-400 ml-1">
              {latestReading.unit}
            </span>
          </p>
          <p className="text-xs text-gray-500">
            {new Date(latestReading.timestamp).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}

function AnomalyCard({ anomaly }: { anomaly: Anomaly }) {
  return (
    <div
      className="bg-[#0B1220] rounded-xl border p-4"
      style={{ borderColor: SEVERITY_COLORS[anomaly.severity] + "50" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-mono px-2 py-1 rounded"
          style={{
            backgroundColor: SEVERITY_COLORS[anomaly.severity] + "20",
            color: SEVERITY_COLORS[anomaly.severity],
          }}
        >
          {anomaly.severity}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(anomaly.detectedAt).toLocaleTimeString()}
        </span>
      </div>
      <p className="font-bold text-sm">{anomaly.anomalyType.replace("_", " ")}</p>
      <p className="text-xs text-gray-400 mt-1">
        Sensor: {anomaly.sensor.sensorCode}
      </p>
      <p className="text-xs text-gray-500">
        Value: {anomaly.detectedValue} | Expected: {anomaly.expectedRange}
      </p>
    </div>
  );
}

function MLPredictionCard({ prediction }: { prediction: MLPrediction }) {
  const riskColors = {
    LOW: "#4CAF50",
    MEDIUM: "#FF9800",
    HIGH: "#F44336",
    CRITICAL: "#B71C1C",
  };

  const riskColor = riskColors[prediction.failureRisk];

  return (
    <div className="bg-[#0B1220] rounded-xl border border-purple-500/20 p-3">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-mono px-2 py-1 rounded"
          style={{
            backgroundColor: riskColor + "20",
            color: riskColor,
          }}
        >
          {prediction.failureRisk}
        </span>
        {prediction.predictedFailure24h && (
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded animate-pulse">
            ⚠️ 24h Alert
          </span>
        )}
      </div>
      <p className="font-bold text-sm text-white">{prediction.structure.name}</p>
      <p className="text-xs text-gray-400">{prediction.structure.type}</p>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 bg-[#1F2937] rounded-full h-2 overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${prediction.failureProbability * 100}%`,
              backgroundColor: riskColor,
            }}
          />
        </div>
        <span className="text-xs font-mono text-gray-400">
          {(prediction.failureProbability * 100).toFixed(1)}%
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Confidence: {(prediction.confidenceScore * 100).toFixed(0)}% | {prediction.modelVersion}
      </p>
    </div>
  );
}

function MLAnomalyCard({ anomaly }: { anomaly: MLAnomaly }) {
  const scoreColor = anomaly.anomalyScore > 0.7 ? "#F44336" : anomaly.anomalyScore > 0.5 ? "#FF9800" : "#FFC107";

  return (
    <div className="bg-[#0B1220] rounded-xl border border-pink-500/20 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono px-2 py-1 rounded bg-purple-500/20 text-purple-400">
          {anomaly.readingType}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(anomaly.detectedAt).toLocaleTimeString()}
        </span>
      </div>
      <p className="font-bold text-sm text-white">{anomaly.sensor.structure.name}</p>
      <p className="text-xs text-gray-400 mb-2">Sensor: {anomaly.sensor.sensorCode}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Anomaly Score:</span>
        <div className="flex-1 bg-[#1F2937] rounded-full h-2 overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${anomaly.anomalyScore * 100}%`,
              backgroundColor: scoreColor,
            }}
          />
        </div>
        <span
          className="text-xs font-mono font-bold"
          style={{ color: scoreColor }}
        >
          {anomaly.anomalyScore.toFixed(3)}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Value: {anomaly.value.toFixed(2)} | {anomaly.modelVersion}
      </p>
    </div>
  );
}
