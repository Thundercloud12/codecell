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
  const [statusFilter, setStatusFilter] = useState<"active" | "resolved" | "all">("active");

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

  if (loading) return (
    <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#1E3A5F] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[#1E3A5F] font-medium">Loading potholes...</span>
      </div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
      <div className="bg-white border-2 border-red-200 rounded-xl p-8 text-center">
        <p className="text-[#C62828] font-medium">Error: {error}</p>
      </div>
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
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-2 border-[#E5E1D8] pb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A5F]">
              Pothole Registry
            </h1>
            <p className="text-[#5A6C7D] text-sm mt-1">Infrastructure damage database</p>
          </div>
          <Link
            href="/potholes/create"
            className="bg-[#1E3A5F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2A4A6F] transition flex items-center gap-2"
          >
            + Add Pothole
          </Link>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex flex-wrap gap-3">
          {[
            { id: 'active', label: 'Active', count: potholes.filter(p => !p.ticket || p.ticket.status !== "RESOLVED").length, activeClass: 'bg-blue-600 text-white border-blue-600' },
            { id: 'resolved', label: 'Resolved', count: potholes.filter(p => p.ticket?.status === "RESOLVED").length, activeClass: 'bg-green-600 text-white border-green-600' },
            { id: 'all', label: 'All', count: potholes.length, activeClass: 'bg-[#1E3A5F] text-white border-[#1E3A5F]' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id as any)}
              className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition ${
                statusFilter === btn.id
                  ? btn.activeClass
                  : 'bg-white text-[#5A6C7D] border-[#E5E1D8] hover:border-[#1E3A5F]'
              }`}
            >
              {btn.label} <span className="bg-black/10 px-2 py-0.5 rounded ml-2">{btn.count}</span>
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {['', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition ${
                filter === lvl
                  ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                  : 'bg-white text-[#5A6C7D] border-[#E5E1D8] hover:border-[#1E3A5F]'
              }`}
            >
              {lvl || 'All Priorities'}
            </button>
          ))}
        </div>

        {filteredPotholes.length === 0 ? (
          <div className="bg-white border-2 border-[#E5E1D8] rounded-xl p-12 text-center text-[#5A6C7D] shadow-sm">
            No potholes found matching your filters.
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPotholes.map((pothole) => (
              <Link
                key={pothole.id}
                href={`/potholes/${pothole.id}`}
                className="bg-white border-2 border-[#E5E1D8] rounded-xl p-6 hover:border-[#1E3A5F] transition group relative overflow-hidden shadow-sm"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E5E1D8] group-hover:bg-[#1E3A5F] transition-colors"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pl-4">
                  <div>
                    <div className="text-xs text-[#5A6C7D] mb-1">
                      ID: {pothole.id.slice(0, 8)}...
                    </div>
                    <div className="text-lg font-bold text-[#1E3A5F] group-hover:text-[#2A4A6F] transition">
                      {pothole.roadInfo?.roadName || "Unknown Road"}
                    </div>
                    <div className="text-sm text-[#5A6C7D] mt-1 flex gap-4">
                      <span>Lat: {pothole.latitude.toFixed(6)}</span>
                      <span>Lng: {pothole.longitude.toFixed(6)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-[#5A6C7D]">Confidence</div>
                      <div className="text-[#1E3A5F] font-bold">
                        {(pothole.detection.confidence * 100).toFixed(1)}%
                      </div>
                    </div>

                    {pothole.priorityLevel && (
                      <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        pothole.priorityLevel === "CRITICAL"
                          ? "bg-red-100 text-red-700"
                          : pothole.priorityLevel === "HIGH"
                            ? "bg-orange-100 text-orange-700"
                            : pothole.priorityLevel === "MEDIUM"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                      }`}>
                        {pothole.priorityLevel}
                        {pothole.priorityScore !== null && <span className="ml-1 opacity-70">({pothole.priorityScore})</span>}
                      </div>
                    )}

                    {pothole.ticket && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pothole.ticket.status === 'RESOLVED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
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
