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

  if (loading) return <div className="p-8">Loading...</div>;
  if (!ticket) return <div className="p-8 text-red-600">Ticket not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/tickets" className="text-blue-600 mb-4 inline-block">
        ← Back to Tickets
      </Link>

      <h1 className="text-3xl font-bold mb-2">{ticket.ticketNumber}</h1>
      <div className="mb-6">
        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded font-semibold">
          {ticket.status}
        </span>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          Pothole Details{" "}
          {ticket.potholes.length > 1 &&
            `(${ticket.potholes.length} locations)`}
        </h2>
        {ticket.potholes.map((pothole, index) => (
          <div
            key={pothole.id}
            className={`${index > 0 ? "mt-6 pt-6 border-t" : ""}`}
          >
            {ticket.potholes.length > 1 && (
              <div className="text-sm font-semibold text-gray-600 mb-3">
                Location {index + 1} of {ticket.potholes.length}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Coordinates</label>
                <div>
                  {pothole.latitude.toFixed(6)}, {pothole.longitude.toFixed(6)}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Road</label>
                <div>{pothole.roadInfo?.roadName || "Unknown"}</div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Priority</label>
                <div>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      pothole.priorityLevel === "CRITICAL"
                        ? "bg-red-100 text-red-800"
                        : pothole.priorityLevel === "HIGH"
                          ? "bg-orange-100 text-orange-800"
                          : pothole.priorityLevel === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                    }`}
                  >
                    {pothole.priorityLevel}
                  </span>
                  <span className="ml-2 font-bold">
                    {pothole.priorityScore}/100
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Actions</label>
                <div>
                  <Link
                    href={`/potholes/${pothole.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Worker Assignment</h2>
        {ticket.assignedWorker ? (
          <div>
            <div className="mb-2">
              <label className="text-sm text-gray-500">Assigned Worker</label>
              <div className="text-lg font-semibold">
                {ticket.assignedWorker.name}
              </div>
              <div className="text-sm text-gray-600">
                {ticket.assignedWorker.email}
              </div>
            </div>
            {ticket.assignedAt && (
              <div className="text-sm text-gray-500">
                Assigned: {new Date(ticket.assignedAt).toLocaleString()}
              </div>
            )}
            <Link
              href={`/workers/${ticket.assignedWorker.id}`}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View Worker Dashboard →
            </Link>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Worker
            </label>
            <select
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              className="border rounded px-3 py-2 mb-4 w-full"
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
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {actionLoading ? "Assigning..." : "Assign Worker"}
            </button>
          </div>
        )}
      </div>

      {ticket.routeData && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Route Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Distance</label>
              <div>{(ticket.routeData.distance / 1000).toFixed(2)} km</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Duration</label>
              <div>{Math.round(ticket.routeData.duration / 60)} minutes</div>
            </div>
            {ticket.estimatedETA && (
              <div>
                <label className="text-sm text-gray-500">ETA</label>
                <div>{new Date(ticket.estimatedETA).toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {ticket.workProofs.length > 0 && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Work Proof</h2>
          {ticket.workProofs.map((proof) => (
            <div key={proof.id} className="mb-4 pb-4 border-b last:border-b-0">
              <div className="grid grid-cols-2 gap-4 mb-2">
                {proof.imageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="Proof"
                    className="rounded border"
                  />
                ))}
              </div>
              {proof.notes && (
                <div className="mb-2">
                  <label className="text-sm text-gray-500">Notes</label>
                  <div>{proof.notes}</div>
                </div>
              )}
              <div className="text-sm text-gray-500">
                Submitted: {new Date(proof.submittedAt).toLocaleString()}
              </div>
              {proof.isApproved !== null && (
                <div className="mt-2">
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      proof.isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
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

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Status Management</h2>
        <div className="text-sm text-gray-600 mb-4">
          Current: <span className="font-semibold">{ticket.status}</span>
        </div>

        {/* Admin Actions for AWAITING_VERIFICATION */}
        {ticket.status === "AWAITING_VERIFICATION" && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-bold text-yellow-900 mb-3">
              🔍 Admin Review Required
            </h3>
            <p className="text-sm text-yellow-800 mb-4">
              The worker has submitted proof of completion. Please review and
              approve or reject.
            </p>
            <div className="flex gap-3">
              <button
                onClick={markAsResolved}
                disabled={actionLoading}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-bold text-lg shadow-lg transition transform hover:scale-105"
              >
                {actionLoading ? "Processing..." : "✅ Mark as Resolved"}
              </button>
              <button
                onClick={rejectProof}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-bold text-lg shadow-lg transition transform hover:scale-105"
              >
                {actionLoading ? "Processing..." : "❌ Reject Proof"}
              </button>
            </div>
          </div>
        )}

        {/* Status indicator for RESOLVED */}
        {ticket.status === "RESOLVED" && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <span className="text-2xl">✅</span>
              <span className="font-bold">Ticket Resolved</span>
            </div>
            <p className="text-sm text-green-700 mt-2">
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
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              Mark as Ranked
            </button>
          )}
          {ticket.status === "REJECTED" && (
            <button
              onClick={() => updateStatus("RANKED")}
              disabled={actionLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Re-rank
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
