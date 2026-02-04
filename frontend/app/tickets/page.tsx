"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Ticket {
  id: string;
  ticketNumber: string;
  status: string;
  createdAt: string;
  pothole: {
    latitude: number;
    longitude: number;
    priorityLevel: string;
    priorityScore: number;
    roadInfo: {
      roadName: string | null;
    } | null;
  };
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

  if (loading) return <div className="p-8">Loading tickets...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

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
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tickets</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("")}
          className={`px-4 py-2 rounded text-sm ${!statusFilter ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          All
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded text-sm ${statusFilter === status ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      {tickets.length === 0 ? (
        <div className="text-gray-500">No tickets found</div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/tickets/${ticket.id}`}
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-mono text-lg font-bold">
                    {ticket.ticketNumber}
                  </div>
                  <div className="text-gray-600 mt-1">
                    {ticket.pothole.roadInfo?.roadName || "Unknown Road"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {ticket.pothole.latitude.toFixed(6)},{" "}
                    {ticket.pothole.longitude.toFixed(6)}
                  </div>
                  {ticket.assignedWorker && (
                    <div className="text-sm text-gray-600 mt-2">
                      Worker: {ticket.assignedWorker.name}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                    {ticket.status}
                  </span>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        ticket.pothole.priorityLevel === "CRITICAL"
                          ? "bg-red-100 text-red-800"
                          : ticket.pothole.priorityLevel === "HIGH"
                            ? "bg-orange-100 text-orange-800"
                            : ticket.pothole.priorityLevel === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                      }`}
                    >
                      {ticket.pothole.priorityLevel}
                    </span>
                    <span className="ml-2 font-bold">
                      {ticket.pothole.priorityScore}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
