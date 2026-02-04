"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Ticket {
  id: string;
  ticketNumber: string;
  status: string;
  createdAt: string;
  potholes: Array<{
    id: string;
    latitude: number;
    longitude: number;
    priorityLevel: string;
    priorityScore: number;
    roadInfo: {
      roadName: string | null;
    } | null;
  }>;
  assignedWorker: {
    name: string;
  } | null;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  async function fetchTickets() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/tickets?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setTickets(data.tickets);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#050B16] flex items-center justify-center text-[#00E676] font-mono animate-pulse">
        LOADING_OPERATIONS_DB...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#050B16] flex items-center justify-center text-[#FF1744] font-mono">
        DB_CONNECTION_ERROR: {error}
      </div>
    );

  const statuses = [
    "DETECTED",
    "RANKED",
    "ASSIGNED",
    "IN_PROGRESS",
    "AWAITING_VERIFICATION",
    "RESOLVED",
    "REJECTED",
  ];

  return (
    <div className="min-h-screen bg-[#050B16] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-[#1F2937] pb-6">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              Global<span className="text-[#00B8D4]">Operations</span>
            </h1>
            <p className="text-[#94A3B8] font-mono text-sm mt-1">
              ACTIVE WORK ORDERS & FIELD MISSIONS
            </p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-[10px] uppercase text-[#94A3B8] font-mono">
              Order Count
            </div>
            <div className="text-3xl font-black text-white">
              {tickets.length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("")}
            className={`px-4 py-2 rounded font-bold uppercase tracking-wider text-xs border transition ${!statusFilter ? "bg-white text-black border-white" : "bg-[#0B1220] text-[#94A3B8] border-[#1F2937] hover:border-white/50"}`}
          >
            ALL OPS
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded font-bold uppercase tracking-wider text-xs border transition ${
                statusFilter === status
                  ? "bg-[#00B8D4] text-black border-[#00B8D4] shadow-[0_0_15px_rgba(0,184,212,0.3)]"
                  : "bg-[#0B1220] text-[#94A3B8] border-[#1F2937] hover:border-[#00B8D4]"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>

        {tickets.length === 0 ? (
          <div className="bg-[#0B1220] border border-[#1F2937] rounded-xl p-12 text-center text-[#94A3B8] font-mono">
            NO_ACTIVE_OPERATIONS_FOUND
          </div>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => {
              const primaryPothole = ticket.potholes[0];
              return (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className="bg-[#0B1220] border border-[#1F2937] rounded-xl p-6 hover:border-[#00E676]/50 hover:bg-[#0B1220]/80 transition group relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1F2937] group-hover:bg-[#00E676] transition-colors"></div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pl-4">
                    {/* ID & Location */}
                    <div className="flex-1">
                      <div className="font-mono text-xs text-[#00B8D4] mb-1 flex items-center gap-2">
                        OP_ID: {ticket.ticketNumber}
                        {ticket.potholes.length > 1 && (
                          <span className="px-2 py-0.5 bg-[#00B8D4]/20 text-[#00B8D4] text-[10px] rounded font-bold">
                            {ticket.potholes.length} SITES
                          </span>
                        )}
                      </div>
                      <div className="text-xl font-bold text-white group-hover:text-[#00E676] transition uppercase tracking-wide">
                        {primaryPothole?.roadInfo?.roadName || "UNKNOWN_SECTOR"}
                      </div>
                      <div className="text-xs text-[#94A3B8] font-mono mt-1 flex gap-4">
                        {new Date(ticket.createdAt).toLocaleDateString()}{" "}
                        <span className="opacity-50">|</span>
                        {primaryPothole &&
                          `LAT: ${primaryPothole.latitude.toFixed(4)}...`}
                      </div>
                    </div>

                    {/* Status & Priority */}
                    <div className="flex flex-wrap items-center gap-4 md:gap-8">
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-[#94A3B8] uppercase">
                          Assigned Agent
                        </div>
                        <div className="font-mono text-white text-sm">
                          {ticket.assignedWorker ? (
                            ticket.assignedWorker.name
                          ) : (
                            <span className="text-[#FF1744] italic">
                              UNASSIGNED
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-bold text-[#94A3B8] uppercase">
                          Threat Level
                        </div>
                        <div
                          className={`font-black uppercase italic ${
                            primaryPothole?.priorityLevel === "CRITICAL"
                              ? "text-[#FF1744]"
                              : primaryPothole?.priorityLevel === "HIGH"
                                ? "text-[#FF9100]"
                                : "text-[#00E676]"
                          }`}
                        >
                          {primaryPothole?.priorityLevel || "N/A"}
                        </div>
                      </div>

                      <div
                        className={`px-3 py-1.5 rounded textxs font-bold uppercase border tracking-wider ${
                          ticket.status === "RESOLVED"
                            ? "border-[#00E676] text-[#00E676] bg-[#00E676]/10"
                            : ticket.status === "IN_PROGRESS"
                              ? "border-[#00B8D4] text-[#00B8D4] bg-[#00B8D4]/10"
                              : "border-[#94A3B8] text-[#94A3B8]"
                        }`}
                      >
                        {ticket.status.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
