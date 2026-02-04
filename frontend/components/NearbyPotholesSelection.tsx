"use client";

import { useState, useEffect } from "react";

interface NearbyPothole {
  id: string;
  latitude: number;
  longitude: number;
  distance: number;
  priorityScore: number | null;
  priorityLevel: string | null;
  detection: {
    confidence: number;
  };
  roadInfo: {
    roadName: string | null;
    roadType: string | null;
  } | null;
}

interface NearbyPotholesSelectionProps {
  sourcePotholeId: string;
  onSelectionChange: (selectedIds: string[]) => void;
  initialSelectedIds?: string[];
  radius?: number;
}

export default function NearbyPotholesSelection({
  sourcePotholeId,
  onSelectionChange,
  initialSelectedIds = [],
  radius = 500,
}: NearbyPotholesSelectionProps) {
  const [nearbyPotholes, setNearbyPotholes] = useState<NearbyPothole[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialSelectedIds),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchRadius, setSearchRadius] = useState(radius);

  useEffect(() => {
    fetchNearbyPotholes();
  }, [sourcePotholeId, searchRadius]);

  async function fetchNearbyPotholes() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        potholeId: sourcePotholeId,
        radius: searchRadius.toString(),
        excludeWithTickets: "true",
      });

      const res = await fetch(`/api/potholes/nearby?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setNearbyPotholes(data.potholes);
      } else {
        setError(data.error || "Failed to fetch nearby potholes");
      }
    } catch (err) {
      setError("Failed to fetch nearby potholes");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelection(potholeId: string) {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(potholeId)) {
      newSelection.delete(potholeId);
    } else {
      newSelection.add(potholeId);
    }
    setSelectedIds(newSelection);
    onSelectionChange(Array.from(newSelection));
  }

  function selectAll() {
    const allIds = nearbyPotholes.map((p) => p.id);
    setSelectedIds(new Set(allIds));
    onSelectionChange(allIds);
  }

  function clearAll() {
    setSelectedIds(new Set());
    onSelectionChange([]);
  }

  if (loading) {
    return (
      <div className="bg-[#0B1220] border border-[#1F2937] rounded-xl p-6">
        <div className="text-[#00E676] font-mono text-sm animate-pulse">
          SCANNING_NEARBY_HAZARDS...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0B1220] border border-[#FF1744] rounded-xl p-6">
        <div className="text-[#FF1744] font-mono text-sm">ERROR: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1220] border border-[#1F2937] rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-bold text-lg mb-1">
            Nearby Potholes on Same Route
          </h3>
          <p className="text-[#94A3B8] text-sm font-mono">
            Select additional potholes to include in this ticket
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#94A3B8] text-xs font-mono">Radius:</label>
          <select
            value={searchRadius}
            onChange={(e) => setSearchRadius(parseInt(e.target.value))}
            className="bg-[#050B16] border border-[#1F2937] text-white px-3 py-1 rounded text-sm font-mono"
          >
            <option value="250">250m</option>
            <option value="500">500m</option>
            <option value="1000">1km</option>
            <option value="2000">2km</option>
            <option value="5000">5km</option>
          </select>
        </div>
      </div>

      {nearbyPotholes.length === 0 ? (
        <div className="text-center py-8 text-[#94A3B8] font-mono text-sm">
          NO_NEARBY_POTHOLES_DETECTED
          <br />
          <span className="text-xs">Try increasing the search radius</span>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#1F2937]">
            <div className="text-[#94A3B8] text-sm">
              Found{" "}
              <span className="text-[#00E676] font-bold">
                {nearbyPotholes.length}
              </span>{" "}
              nearby pothole(s)
              {selectedIds.size > 0 && (
                <span className="ml-2">
                  •{" "}
                  <span className="text-[#00B8D4] font-bold">
                    {selectedIds.size}
                  </span>{" "}
                  selected
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-[#00B8D4] hover:text-[#00E676] text-xs font-bold uppercase transition"
              >
                Select All
              </button>
              {selectedIds.size > 0 && (
                <button
                  onClick={clearAll}
                  className="text-[#FF1744] hover:text-[#FF9100] text-xs font-bold uppercase transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {nearbyPotholes.map((pothole) => {
              const isSelected = selectedIds.has(pothole.id);
              return (
                <div
                  key={pothole.id}
                  onClick={() => toggleSelection(pothole.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    isSelected
                      ? "bg-[#00E676]/10 border-[#00E676] shadow-[0_0_10px_rgba(0,230,118,0.2)]"
                      : "bg-[#050B16] border-[#1F2937] hover:border-[#00B8D4]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                            isSelected
                              ? "bg-[#00E676] border-[#00E676]"
                              : "border-[#1F2937]"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-black"
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
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono text-sm">
                            {pothole.distance < 1000
                              ? `${Math.round(pothole.distance)}m away`
                              : `${(pothole.distance / 1000).toFixed(2)}km away`}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              pothole.priorityLevel === "CRITICAL"
                                ? "bg-[#FF1744]/20 text-[#FF1744]"
                                : pothole.priorityLevel === "HIGH"
                                  ? "bg-[#FF9100]/20 text-[#FF9100]"
                                  : pothole.priorityLevel === "MEDIUM"
                                    ? "bg-[#FFC400]/20 text-[#FFC400]"
                                    : "bg-[#00E676]/20 text-[#00E676]"
                            }`}
                          >
                            {pothole.priorityLevel}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div>
                          <span className="text-[#94A3B8] font-mono">
                            Location:
                          </span>
                          <span className="text-white font-mono ml-2">
                            {pothole.latitude.toFixed(5)},{" "}
                            {pothole.longitude.toFixed(5)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#94A3B8] font-mono">
                            Road:
                          </span>
                          <span className="text-white ml-2">
                            {pothole.roadInfo?.roadName || "Unknown"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#94A3B8] font-mono">
                            Confidence:
                          </span>
                          <span className="text-[#00E676] ml-2 font-bold">
                            {(pothole.detection.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[#94A3B8] font-mono">
                            Priority Score:
                          </span>
                          <span className="text-[#FFC400] ml-2 font-bold">
                            {pothole.priorityScore?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
