"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Pothole {
  id: string;
  latitude: number;
  longitude: number;
  priorityScore: number | null;
  priorityLevel: string | null;
  createdAt: string;
  detection: {
    confidence: number;
  };
  roadInfo: {
    roadName: string | null;
    roadType: string | null;
  } | null;
  ticket: {
    id: string;
    ticketNumber: string;
    status: string;
  } | null;
}

export default function PotholesPage() {
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "active" | "resolved" | "all"
  >("active");

  useEffect(() => {
    fetchPotholes();
  }, [filter]);

  async function fetchPotholes() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter) params.set("priorityLevel", filter);

      const res = await fetch(`/api/potholes?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setPotholes(data.potholes);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch potholes");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center text-[#2E7D32] font-mono animate-pulse">
        LOADING_SECTOR_DATA...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center text-[#D32F2F] font-mono">
        DATA_INTEGRITY_ERROR: {error}
      </div>
    );

  // Filter potholes by status
  const filteredPotholes = potholes.filter((pothole) => {
    if (statusFilter === "resolved") {
      return pothole.ticket?.status === "RESOLVED";
    } else if (statusFilter === "active") {
      return !pothole.ticket || pothole.ticket.status !== "RESOLVED";
    }
    return true; // "all"
  });

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-[#D4D1C8] pb-6">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              Pothole
              <span className="bg-gradient-to-r from-[#2E7D32] to-[#1565C0] text-transparent bg-clip-text">
                Registry
              </span>
            </h1>
            <p className="text-[#5A6C7D] font-mono text-sm mt-1">
              SECTOR INFRASTRUCTURE DATABASE
            </p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            {
              id: "active",
              label: "🔵 ACTIVE SIGNALS",
              count: potholes.filter(
                (p) => !p.ticket || p.ticket.status !== "RESOLVED",
              ).length,
              color: "border-[#1565C0] text-[#1565C0]",
            },
            {
              id: "resolved",
              label: "✅ RESOLVED",
              count: potholes.filter((p) => p.ticket?.status === "RESOLVED")
                .length,
              color: "border-[#2E7D32] text-[#2E7D32]",
            },
            {
              id: "all",
              label: "📊 GLOBAL VIEW",
              count: potholes.length,
              color: "border-[#1E3A5F] text-[#1E3A5F]",
            },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id as any)}
              className={`px-4 py-3 rounded border font-bold uppercase tracking-wider text-xs transition ${
                statusFilter === btn.id
                  ? `${btn.color} bg-white shadow-lg`
                  : `border-[#D4D1C8] text-[#5A6C7D] hover:border-[#1E3A5F]/50 bg-white`
              }`}
            >
              {btn.label}{" "}
              <span className="bg-[#F8F6F1] px-1 py-0.5 rounded ml-2 text-[#1E3A5F]">
                {btn.count}
              </span>
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {["", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider border transition ${
                filter === lvl
                  ? "bg-[#1565C0] text-white border-[#1565C0]"
                  : "bg-white text-[#5A6C7D] border-[#D4D1C8] hover:border-[#1565C0]"
              }`}
            >
              {lvl || "ALL SEVERITIES"}
            </button>
          ))}
        </div>

        {filteredPotholes.length === 0 ? (
          <div className="bg-white border border-[#D4D1C8] rounded-xl p-12 text-center text-[#5A6C7D] font-mono">
            NO_RECORDS_FOUND_IN_QUERY_RANGE
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPotholes.map((pothole) => (
              <Link
                key={pothole.id}
                href={`/potholes/${pothole.id}`}
                className="bg-white border border-[#D4D1C8] rounded-xl p-6 hover:border-[#2E7D32]/50 hover:shadow-lg transition group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4D1C8] group-hover:bg-[#2E7D32] transition-colors"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pl-4">
                  <div>
                    <div className="font-mono text-xs text-[#5A6C7D] opacity-50 mb-1">
                      ID: {pothole.id}
                    </div>
                    <div className="text-xl font-bold text-[#1E3A5F] group-hover:text-[#2E7D32] transition uppercase tracking-wide">
                      {pothole.roadInfo?.roadName || "UNKNOWN_SECTOR_ROAD"}
                    </div>
                    <div className="text-xs text-[#5A6C7D] font-mono mt-1 flex gap-4">
                      <span>LAT: {pothole.latitude.toFixed(6)}</span>
                      <span>LNG: {pothole.longitude.toFixed(6)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-[#5A6C7D] uppercase">
                        Confidence
                      </div>
                      <div className="text-[#1565C0] font-mono font-bold">
                        {(pothole.detection.confidence * 100).toFixed(1)}%
                      </div>
                    </div>

                    {pothole.priorityLevel && (
                      <div
                        className={`px-3 py-2 rounded text-xs font-black uppercase tracking-widest border ${
                          pothole.priorityLevel === "CRITICAL"
                            ? "bg-[#D32F2F]/10 text-[#D32F2F] border-[#D32F2F]/30"
                            : pothole.priorityLevel === "HIGH"
                              ? "bg-[#F57C00]/10 text-[#F57C00] border-[#F57C00]/30"
                              : pothole.priorityLevel === "MEDIUM"
                                ? "bg-[#FBC02D]/10 text-[#F57C00] border-[#FBC02D]/30"
                                : "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/30"
                        }`}
                      >
                        {pothole.priorityLevel}
                        {pothole.priorityScore !== null && (
                          <span className="ml-2 opacity-70 border-l border-current pl-2">
                            {pothole.priorityScore}
                          </span>
                        )}
                      </div>
                    )}

                    {pothole.ticket && (
                      <div
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                          pothole.ticket.status === "RESOLVED"
                            ? "border-[#2E7D32]/50 text-[#2E7D32] bg-[#2E7D32]/5"
                            : "border-[#1565C0]/50 text-[#1565C0] bg-[#1565C0]/5"
                        }`}
                      >
                        {pothole.ticket.status}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}