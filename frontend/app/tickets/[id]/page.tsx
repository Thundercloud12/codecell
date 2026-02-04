"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface TicketDetail {
  id: string;
  ticketNumber: string;
  status: string;
  createdAt: string;
  assignedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  estimatedETA: string | null;
  routeData: any;
  potholes: Array<{
    id: string;
    latitude: number;
    longitude: number;
    priorityLevel: string;
    priorityScore: number;
    roadInfo: {
      roadName: string | null;
      roadType: string | null;
    } | null;
  }>;
  assignedWorker: {
    id: string;
    name: string;
    email: string;
  } | null;
  workProofs: Array<{
    id: string;
    imageUrls: string[];
    notes: string | null;
    submittedAt: string;
    isApproved: boolean | null;
  }>;
}

export default function TicketDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [workers, setWorkers] = useState<Array<{ id: string; name: string }>>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");

  useEffect(() => {
    fetchTicket();
    fetchWorkers();
  }, [id]);

  async function fetchTicket() {
    try {
      const res = await fetch(`/api/tickets?limit=100`);
      const data = await res.json();

      if (data.success) {
        const found = data.tickets.find((t: any) => t.id === id);
        if (found) {
          setTicket(found);
        } else {
          setError("Ticket not found");
        }
      }
    } catch (err) {
      setError("Failed to fetch ticket");
    } finally {
      setLoading(false);
    }
  }

  async function fetchWorkers() {
    try {
      const res = await fetch("/api/workers");
      const data = await res.json();
      if (data.success) {
        setWorkers(data.workers);
      }
    } catch (err) {
      console.error("Failed to fetch workers");
    }
  }

  async function assignWorker() {
    if (!selectedWorker) return;

    try {
      setActionLoading(true);
      setMessage("");
      setError("");

      const res = await fetch(`/api/tickets/${id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId: selectedWorker }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Worker assigned successfully");
        fetchTicket();
      } else {
        setError(data.error || "Failed to assign worker");
      }
    } catch (err) {
      setError("Failed to assign worker");
    } finally {
      setActionLoading(false);
    }
  }

  async function markAsResolved() {
    if (!confirm("Are you sure you want to mark this ticket as resolved?")) {
      return;
    }

    try {
      setActionLoading(true);
      setMessage("");
      setError("");

      const res = await fetch(`/api/admin/review/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE",
          reviewedBy: "admin-user",
          reviewNotes: "Work approved and completed",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Ticket marked as resolved successfully!");
        fetchTicket();
      } else {
        setError(data.error || "Failed to mark as resolved");
      }
    } catch (err) {
      setError("Failed to mark as resolved");
    } finally {
      setActionLoading(false);
    }
  }

  async function rejectProof() {
    if (!confirm("Are you sure you want to reject this proof?")) {
      return;
    }

    try {
      setActionLoading(true);
      setMessage("");
      setError("");

      const res = await fetch(`/api/admin/review/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REJECT",
          reviewedBy: "admin-user",
          reviewNotes: "Work proof rejected - please resubmit",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Proof rejected - worker can resubmit");
        fetchTicket();
      } else {
        setError(data.error || "Failed to reject proof");
      }
    } catch (err) {
      setError("Failed to reject proof");
    } finally {
      setActionLoading(false);
    }
  }

  async function updateStatus(newStatus: string) {
    try {
      setActionLoading(true);
      setMessage("");
      setError("");

      const res = await fetch(`/api/tickets/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`Status updated to ${newStatus}`);
        fetchTicket();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center text-[#2E7D32] font-mono animate-pulse">
        LOADING_OPERATION...
      </div>
    );
  if (!ticket)
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center text-[#D32F2F] font-mono">
        OPERATION_NOT_FOUND
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/tickets"
          className="text-[#1565C0] mb-8 inline-flex items-center gap-2 hover:text-[#2E7D32] transition font-mono text-sm uppercase tracking-wider"
        >
          ← Back to Tickets
        </Link>

        <div className="mb-8 pb-6 border-b border-[#D4D1C8]">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-3">
            <span className="bg-gradient-to-r from-[#2E7D32] to-[#1565C0] text-transparent bg-clip-text">
              Operation
            </span>{" "}
            {ticket.ticketNumber}
          </h1>
          <div>
            <span
              className={`px-4 py-2 rounded text-sm font-bold uppercase border tracking-wider ${
                ticket.status === "RESOLVED"
                  ? "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]"
                  : ticket.status === "IN_PROGRESS"
                    ? "bg-[#1565C0]/10 text-[#1565C0] border-[#1565C0]"
                    : ticket.status === "AWAITING_VERIFICATION"
                      ? "bg-[#F57C00]/10 text-[#F57C00] border-[#F57C00]"
                      : "bg-[#5A6C7D]/10 text-[#5A6C7D] border-[#5A6C7D]"
              }`}
            >
              {ticket.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {message && (
          <div className="bg-[#2E7D32]/10 border border-[#2E7D32] text-[#2E7D32] px-4 py-3 rounded-lg mb-6 font-mono text-sm shadow-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-[#D32F2F]/10 border border-[#D32F2F] text-[#D32F2F] px-4 py-3 rounded-lg mb-6 font-mono text-sm shadow-lg">
            {error}
          </div>
        )}

        <div className="bg-white border border-[#D4D1C8] rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#1E3A5F] mb-4 uppercase tracking-wide">
            Pothole Details{" "}
            {ticket.potholes.length > 1 &&
              `(${ticket.potholes.length} locations)`}
          </h2>
          {ticket.potholes.map((pothole, index) => (
            <div
              key={pothole.id}
              className={`${index > 0 ? "mt-6 pt-6 border-t border-[#D4D1C8]" : ""}`}
            >
              {ticket.potholes.length > 1 && (
                <div className="text-sm font-semibold text-[#5A6C7D] mb-3">
                  Location {index + 1} of {ticket.potholes.length}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#5A6C7D] uppercase font-bold">
                    Coordinates
                  </label>
                  <div className="font-mono text-[#1E3A5F]">
                    {pothole.latitude.toFixed(6)},{" "}
                    {pothole.longitude.toFixed(6)}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#5A6C7D] uppercase font-bold">
                    Road
                  </label>
                  <div className="font-semibold text-[#1E3A5F]">
                    {pothole.roadInfo?.roadName || "Unknown"}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#5A6C7D] uppercase font-bold">
                    Priority
                  </label>
                  <div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-bold uppercase border ${
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
                    </span>
                    <span className="ml-2 font-bold text-[#1E3A5F]">
                      {pothole.priorityScore}/100
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#5A6C7D] uppercase font-bold">
                    Actions
                  </label>
                  <div>
                    <Link
                      href={`/potholes/${pothole.id}`}
                      className="text-[#1565C0] hover:text-[#2E7D32] text-sm font-semibold transition"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#D4D1C8] rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#1E3A5F] mb-4 uppercase tracking-wide">
            Worker Assignment
          </h2>
          {ticket.assignedWorker ? (
            <div>
              <div className="mb-2">
                <label className="text-xs text-[#5A6C7D] uppercase font-bold">
                  Assigned Worker
                </label>
                <div className="text-lg font-bold text-[#1E3A5F]">
                  {ticket.assignedWorker.name}
                </div>
                <div className="text-sm text-[#5A6C7D]">
                  {ticket.assignedWorker.email}
                </div>
              </div>
              {ticket.assignedAt && (
                <div className="text-sm text-[#5A6C7D] font-mono">
                  Assigned: {new Date(ticket.assignedAt).toLocaleString()}
                </div>
              )}
              <Link
                href={`/workers/${ticket.assignedWorker.id}`}
                className="text-[#1565C0] hover:text-[#2E7D32] font-semibold mt-2 inline-block transition"
              >
                View Worker Dashboard →
              </Link>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-[#5A6C7D] uppercase mb-2">
                Select Worker
              </label>
              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                className="border border-[#D4D1C8] rounded-lg px-4 py-3 mb-4 w-full focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 transition"
              >
                <option value="">-- Select a worker --</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name}
                  </option>
                ))}
              </select>
              <button
                onClick={assignWorker}
                disabled={!selectedWorker || actionLoading}
                className="bg-[#1565C0] text-white px-6 py-3 rounded-lg hover:bg-[#1565C0]/90 disabled:bg-[#D4D1C8] disabled:text-[#5A6C7D] font-bold uppercase tracking-wider transition"
              >
                {actionLoading ? "Assigning..." : "Assign Worker"}
              </button>
            </div>
          )}
        </div>

        {ticket.routeData && (
          <div className="bg-white border border-[#D4D1C8] rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1E3A5F] mb-4 uppercase tracking-wide">
              Route Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#5A6C7D] uppercase font-bold">
                  Distance
                </label>
                <div className="text-[#1E3A5F] font-semibold">
                  {(ticket.routeData.distance / 1000).toFixed(2)} km
                </div>
              </div>
              <div>
                <label className="text-xs text-[#5A6C7D] uppercase font-bold">
                  Duration
                </label>
                <div className="text-[#1E3A5F] font-semibold">
                  {Math.round(ticket.routeData.duration / 60)} minutes
                </div>
              </div>
              {ticket.estimatedETA && (
                <div>
                  <label className="text-xs text-[#5A6C7D] uppercase font-bold">
                    ETA
                  </label>
                  <div className="text-[#1E3A5F] font-semibold">
                    {new Date(ticket.estimatedETA).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {ticket.workProofs.length > 0 && (
          <div className="bg-white border border-[#D4D1C8] rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1E3A5F] mb-4 uppercase tracking-wide">
              Work Proof
            </h2>
            {ticket.workProofs.map((proof) => (
              <div
                key={proof.id}
                className="mb-4 pb-4 border-b border-[#D4D1C8] last:border-b-0"
              >
                <div className="grid grid-cols-2 gap-4 mb-2">
                  {proof.imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Proof"
                      className="rounded border border-[#D4D1C8]"
                    />
                  ))}
                </div>
                {proof.notes && (
                  <div className="mb-2">
                    <label className="text-xs text-[#5A6C7D] uppercase font-bold">
                      Notes
                    </label>
                    <div className="text-[#1E3A5F]">{proof.notes}</div>
                  </div>
                )}
                <div className="text-sm text-[#5A6C7D] font-mono">
                  Submitted: {new Date(proof.submittedAt).toLocaleString()}
                </div>
                {proof.isApproved !== null && (
                  <div className="mt-2">
                    <span
                      className={`px-3 py-1 rounded text-sm font-bold uppercase border ${
                        proof.isApproved
                          ? "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]"
                          : "bg-[#D32F2F]/10 text-[#D32F2F] border-[#D32F2F]"
                      }`}
                    >
                      {proof.isApproved ? "Approved" : "Rejected"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white border border-[#D4D1C8] rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#1E3A5F] mb-4 uppercase tracking-wide">
            Status Management
          </h2>
          <div className="text-sm text-[#5A6C7D] mb-4">
            Current:{" "}
            <span className="font-bold text-[#1E3A5F]">{ticket.status}</span>
          </div>

          {/* Admin Actions for AWAITING_VERIFICATION */}
          {ticket.status === "AWAITING_VERIFICATION" && (
            <div className="mb-4 p-6 bg-[#FBC02D]/10 border-2 border-[#F57C00] rounded-xl">
              <h3 className="font-black text-[#F57C00] mb-3 text-lg uppercase tracking-wide">
                🔍 Admin Review Required
              </h3>
              <p className="text-sm text-[#F57C00] mb-4">
                The worker has submitted proof of completion. Please review and
                approve or reject.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={markAsResolved}
                  disabled={actionLoading}
                  className="flex-1 bg-[#2E7D32] text-white px-6 py-3 rounded-lg hover:bg-[#2E7D32]/90 disabled:bg-[#D4D1C8] disabled:text-[#5A6C7D] font-bold text-lg shadow-lg transition transform hover:scale-105 uppercase tracking-wider"
                >
                  {actionLoading ? "Processing..." : "✅ Mark as Resolved"}
                </button>
                <button
                  onClick={rejectProof}
                  disabled={actionLoading}
                  className="flex-1 bg-[#D32F2F] text-white px-6 py-3 rounded-lg hover:bg-[#D32F2F]/90 disabled:bg-[#D4D1C8] disabled:text-[#5A6C7D] font-bold text-lg shadow-lg transition transform hover:scale-105 uppercase tracking-wider"
                >
                  {actionLoading ? "Processing..." : "❌ Reject Proof"}
                </button>
              </div>
            </div>
          )}

          {/* Status indicator for RESOLVED */}
          {ticket.status === "RESOLVED" && (
            <div className="p-6 bg-[#2E7D32]/10 border-2 border-[#2E7D32] rounded-xl">
              <div className="flex items-center gap-2 text-[#2E7D32]">
                <span className="text-2xl">✅</span>
                <span className="font-black uppercase tracking-wide">
                  Ticket Resolved
                </span>
              </div>
              <p className="text-sm text-[#2E7D32] mt-2">
                This ticket has been completed and approved.
              </p>
            </div>
          )}

          {/* Other status transitions */}
          <div className="flex flex-wrap gap-2">
            {ticket.status === "DETECTED" && (
              <button
                onClick={() => updateStatus("RANKED")}
                disabled={actionLoading}
                className="bg-[#7C4DFF] text-white px-6 py-3 rounded-lg hover:bg-[#7C4DFF]/90 disabled:bg-[#D4D1C8] disabled:text-[#5A6C7D] font-bold uppercase tracking-wider transition"
              >
                Mark as Ranked
              </button>
            )}
            {ticket.status === "REJECTED" && (
              <button
                onClick={() => updateStatus("RANKED")}
                disabled={actionLoading}
                className="bg-[#1565C0] text-white px-6 py-3 rounded-lg hover:bg-[#1565C0]/90 disabled:bg-[#D4D1C8] disabled:text-[#5A6C7D] font-bold uppercase tracking-wider transition"
              >
                Re-rank
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}