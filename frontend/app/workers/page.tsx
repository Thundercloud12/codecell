"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Worker {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  isActive: boolean;
  currentLatitude: number | null;
  currentLongitude: number | null;
  assignedTickets: Array<{
    id: string;
    ticketNumber: string;
    status: string;
  }>;
}

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWorkers();
  }, []);

  async function fetchWorkers() {
    try {
      setLoading(true);
      const res = await fetch("/api/workers");
      const data = await res.json();

      if (data.success) {
        setWorkers(data.workers);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch workers");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center text-[#2E7D32] font-mono animate-pulse">
        LOADING_FIELD_AGENTS...
      </div>
    );
  if (error && workers.length === 0)
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center text-[#D32F2F] font-mono">
        AGENT_RETRIEVAL_ERROR: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 border-b border-[#D4D1C8] pb-6">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            <span className="bg-gradient-to-r from-[#2E7D32] to-[#1565C0] text-transparent bg-clip-text">
              Workers
            </span>
          </h1>
        </div>

        {error && (
          <div className="bg-[#D32F2F]/10 border border-[#D32F2F] text-[#D32F2F] px-4 py-3 rounded-lg mb-6 font-mono">
            {error}
          </div>
        )}

        {workers.length === 0 ? (
          <div className="bg-white border border-[#D4D1C8] rounded-xl p-12 text-center text-[#5A6C7D] font-mono">
            NO_AGENTS_REGISTERED
          </div>
        ) : (
          <div className="grid gap-4">
            {workers.map((worker) => (
              <Link
                key={worker.id}
                href={`/workers/${worker.id}`}
                className="bg-white border border-[#D4D1C8] rounded-xl p-6 hover:border-[#2E7D32]/50 hover:shadow-lg transition group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4D1C8] group-hover:bg-[#2E7D32] transition-colors"></div>
                <div className="flex justify-between items-start pl-4">
                  <div>
                    <div className="text-xl font-bold text-[#1E3A5F] uppercase tracking-wide">
                      {worker.name}
                    </div>
                    <div className="text-sm text-[#5A6C7D] mt-1">
                      {worker.email}
                    </div>
                    <div className="text-sm text-[#5A6C7D] font-mono">
                      ID: {worker.employeeId}
                    </div>
                    {worker.currentLatitude && worker.currentLongitude && (
                      <div className="text-sm text-[#1565C0] font-mono mt-2">
                        📍 {worker.currentLatitude.toFixed(6)},{" "}
                        {worker.currentLongitude.toFixed(6)}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1.5 rounded text-xs font-bold uppercase border tracking-wider ${
                        worker.isActive
                          ? "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]"
                          : "bg-[#5A6C7D]/10 text-[#5A6C7D] border-[#5A6C7D]"
                      }`}
                    >
                      {worker.isActive ? "Active" : "Inactive"}
                    </span>
                    <div className="mt-2 text-sm text-[#5A6C7D] font-mono">
                      {worker.assignedTickets.length} active task
                      {worker.assignedTickets.length !== 1 ? "s" : ""}
                    </div>
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
