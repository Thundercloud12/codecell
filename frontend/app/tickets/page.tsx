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
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center text-[#2E7D32] font-mono animate-pulse">
        LOADING_OPERATIONS_DB...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center text-[#D32F2F] font-mono">
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
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-[#D4D1C8] pb-6">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              Global
              <span className="bg-gradient-to-r from-[#2E7D32] to-[#1565C0] text-transparent bg-clip-text">
                Operations
              </span>
            </h1>
            <p className="text-[#5A6C7D] font-mono text-sm mt-1">
              ACTIVE WORK ORDERS & FIELD MISSIONS
            </p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-[10px] uppercase text-[#5A6C7D] font-mono">
              Order Count
            </div>
            <div className="text-3xl font-black text-[#1E3A5F]">
              {tickets.length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("")}
            className={`px-4 py-2 rounded font-bold uppercase tracking-wider text-xs border transition ${!statusFilter ? "bg-[#1E3A5F] text-white border-[#1E3A5F]" : "bg-white text-[#5A6C7D] border-[#D4D1C8] hover:border-[#1E3A5F]/50"}`}
          >
            ALL OPS
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded font-bold uppercase tracking-wider text-xs border transition ${
                statusFilter === status
                  ? "bg-[#2E7D32] text-white border-[#2E7D32] shadow-lg"
                  : "bg-white text-[#5A6C7D] border-[#D4D1C8] hover:border-[#2E7D32]"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white border border-[#D4D1C8] rounded-xl p-12 text-center text-[#5A6C7D] font-mono">
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
                  className="bg-white border border-[#D4D1C8] rounded-xl p-6 hover:border-[#2E7D32]/50 hover:shadow-lg transition group relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4D1C8] group-hover:bg-[#2E7D32] transition-colors"></div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pl-4">
                    {/* ID & Location */}
                    <div className="flex-1">
                      <div className="font-mono text-xs text-[#1565C0] mb-1 flex items-center gap-2">
                        OP_ID: {ticket.ticketNumber}
                        {ticket.potholes.length > 1 && (
                          <span className="px-2 py-0.5 bg-[#1565C0]/10 text-[#1565C0] text-[10px] rounded font-bold">
                            {ticket.potholes.length} SITES
                          </span>
                        )}
                      </div>
                      <div className="text-xl font-bold text-[#1E3A5F] group-hover:text-[#2E7D32] transition uppercase tracking-wide">
                        {primaryPothole?.roadInfo?.roadName || "UNKNOWN_SECTOR"}
                      </div>
                      <div className="text-xs text-[#5A6C7D] font-mono mt-1 flex gap-4">
                        {new Date(ticket.createdAt).toLocaleDateString()}{" "}
                        <span className="opacity-50">|</span>
                        {primaryPothole &&
                          `LAT: ${primaryPothole.latitude.toFixed(4)}...`}
                      </div>
                    </div>

                    {/* Status & Priority */}
                    <div className="flex flex-wrap items-center gap-4 md:gap-8">
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-[#5A6C7D] uppercase">
                          Assigned Agent
                        </div>
                        <div className="font-mono text-[#1E3A5F] text-sm">
                          {ticket.assignedWorker ? (
                            ticket.assignedWorker.name
                          ) : (
                            <span className="text-[#D32F2F] italic">
                              UNASSIGNED
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-bold text-[#5A6C7D] uppercase">
                          Threat Level
                        </div>
                        <div
                          className={`font-black uppercase italic ${
                            primaryPothole?.priorityLevel === "CRITICAL"
                              ? "text-[#D32F2F]"
                              : primaryPothole?.priorityLevel === "HIGH"
                                ? "text-[#F57C00]"
                                : "text-[#2E7D32]"
                          }`}
                        >
                          {primaryPothole?.priorityLevel || "N/A"}
                        </div>
                      </div>

                      <div
                        className={`px-3 py-1.5 rounded text-xs font-bold uppercase border tracking-wider ${
                          ticket.status === "RESOLVED"
                            ? "border-[#2E7D32] text-[#2E7D32] bg-[#2E7D32]/10"
                            : ticket.status === "IN_PROGRESS"
                              ? "border-[#1565C0] text-[#1565C0] bg-[#1565C0]/10"
                              : "border-[#5A6C7D] text-[#5A6C7D] bg-[#5A6C7D]/5"
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