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
     <div className="min-h-screen bg-[#050B16] flex items-center justify-center text-[#00E676] font-mono animate-pulse">
        LOADING_SECTOR_DATA...
     </div>
  );
  if (error) return (
     <div className="min-h-screen bg-[#050B16] flex items-center justify-center text-[#FF1744] font-mono">
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
    <div className="min-h-screen bg-[#050B16] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-[#1F2937] pb-6">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
               Pothole<span className="text-[#00B8D4]">Registry</span>
            </h1>
            <p className="text-[#94A3B8] font-mono text-sm mt-1">SECTOR INFRASTRUCTURE DATABASE</p>
          </div>
          <Link
            href="/potholes/create"
            className="bg-[#00E676] text-black border border-[#00E676] px-6 py-3 rounded font-bold hover:bg-[#00E676]/80 transition uppercase tracking-wider flex items-center gap-2"
          >
            + Initiate Record
          </Link>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
           {[
             { id: 'active', label: '🔵 ACTIVE SIGNALS', count: potholes.filter(p => !p.ticket || p.ticket.status !== "RESOLVED").length, color: 'border-blue-500 text-blue-500' },
             { id: 'resolved', label: '✅ RESOLVED', count: potholes.filter(p => p.ticket?.status === "RESOLVED").length, color: 'border-green-500 text-green-500' },
             { id: 'all', label: '📊 GLOBAL VIEW', count: potholes.length, color: 'border-white text-white' }
           ].map(btn => (
             <button
               key={btn.id}
               onClick={() => setStatusFilter(btn.id as any)}
               className={`px-4 py-3 rounded border font-bold uppercase tracking-wider text-xs transition ${
                 statusFilter === btn.id
                 ? `${btn.color} bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]`
                 : `border-[#1F2937] text-[#94A3B8] hover:border-white/50 bg-[#0B1220]`
               }`}
             >
               {btn.label} <span className="bg-[#1F2937] px-1 py-0.5 rounded ml-2 text-white">{btn.count}</span>
             </button>
           ))}
        </div>

        {/* Priority Filter */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {['', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(lvl => (
             <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider border transition ${
                   filter === lvl 
                   ? 'bg-[#00B8D4] text-black border-[#00B8D4]' 
                   : 'bg-[#0B1220] text-[#94A3B8] border-[#1F2937] hover:border-[#00B8D4]'
                }`}
             >
                {lvl || 'ALL SEVERITIES'}
             </button>
          ))}
        </div>

        {filteredPotholes.length === 0 ? (
          <div className="bg-[#0B1220] border border-[#1F2937] rounded-xl p-12 text-center text-[#94A3B8] font-mono">
             NO_RECORDS_FOUND_IN_QUERY_RANGE
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPotholes.map((pothole) => (
              <Link
                key={pothole.id}
                href={`/potholes/${pothole.id}`}
                className="bg-[#0B1220] border border-[#1F2937] rounded-xl p-6 hover:border-[#00E676]/50 hover:bg-[#0B1220]/80 transition group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1F2937] group-hover:bg-[#00E676] transition-colors"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pl-4">
                  <div>
                    <div className="font-mono text-xs text-[#94A3B8] opacity-50 mb-1">
                      ID: {pothole.id}
                    </div>
                    <div className="text-xl font-bold text-white group-hover:text-[#00E676] transition uppercase tracking-wide">
                      {pothole.roadInfo?.roadName || "UNKNOWN_SECTOR_ROAD"}
                    </div>
                    <div className="text-xs text-[#94A3B8] font-mono mt-1 flex gap-4">
                      <span>LAT: {pothole.latitude.toFixed(6)}</span>
                      <span>LNG: {pothole.longitude.toFixed(6)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                     <div className="text-right">
                       <div className="text-[10px] font-bold text-[#94A3B8] uppercase">Confidence</div>
                       <div className="text-[#00B8D4] font-mono font-bold">
                         {(pothole.detection.confidence * 100).toFixed(1)}%
                       </div>
                     </div>
                     
                     {pothole.priorityLevel && (
                       <div className={`px-3 py-2 rounded text-xs font-black uppercase tracking-widest border ${
                         pothole.priorityLevel === "CRITICAL"
                           ? "bg-[#FF1744]/10 text-[#FF1744] border-[#FF1744]/30"
                           : pothole.priorityLevel === "HIGH"
                             ? "bg-[#FF9100]/10 text-[#FF9100] border-[#FF9100]/30"
                             : pothole.priorityLevel === "MEDIUM"
                               ? "bg-[#FFC400]/10 text-[#FFC400] border-[#FFC400]/30"
                               : "bg-[#00E676]/10 text-[#00E676] border-[#00E676]/30"
                       }`}>
                         {pothole.priorityLevel}
                         {pothole.priorityScore !== null && <span className="ml-2 opacity-70 border-l border-current pl-2">{pothole.priorityScore}</span>}
                       </div>
                     )}
                     
                    {pothole.ticket && (
                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                            pothole.ticket.status === 'RESOLVED' 
                            ? 'border-green-500/50 text-green-500' 
                            : 'border-blue-500/50 text-blue-500'
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
