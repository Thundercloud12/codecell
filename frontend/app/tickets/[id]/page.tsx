"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import map component to avoid SSR issues
const TicketRouteMap = dynamic(() => import("@/components/TicketRouteMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-[#0B1220] rounded-xl border border-[#1F2937] flex items-center justify-center">
      <div className="text-[#00E676] font-mono animate-pulse">INITIALIZING_NAV_SYSTEM...</div>
    </div>
  ),
});

interface TicketDetail {
  id: string;
  ticketNumber: string;
  status: string;
  createdAt: string;
  assignedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  estimatedETA: string | null;
  routeData: {
    distance: number;
    duration: number;
    polyline?: string;
    startLocation?: {
      latitude: number;
      longitude: number;
    };
  } | null;
  pothole: {
    latitude: number;
    longitude: number;
    priorityLevel: string;
    priorityScore: number;
    roadInfo: {
      roadName: string | null;
      roadType: string | null;
    } | null;
  };
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
  const [workerLocation, setWorkerLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [journeyStarted, setJourneyStarted] = useState(false);

  useEffect(() => {
    fetchTicket();
    fetchWorkers();
  }, [id]);

  // Get worker's current location when journey starts
  useEffect(() => {
    if (journeyStarted && ticket?.status === "IN_PROGRESS") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setWorkerLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            // Default to stored route start location if available
            if (ticket.routeData?.startLocation) {
              setWorkerLocation({
                lat: ticket.routeData.startLocation.latitude,
                lng: ticket.routeData.startLocation.longitude,
              });
            }
          }
        );
      }
    }
  }, [journeyStarted, ticket?.status]);

  // Check if ticket already has route data (journey already started)
  useEffect(() => {
    if (ticket?.routeData && ticket.status === "IN_PROGRESS") {
      setJourneyStarted(true);
      if (ticket.routeData.startLocation) {
        setWorkerLocation({
          lat: ticket.routeData.startLocation.latitude,
          lng: ticket.routeData.startLocation.longitude,
        });
      }
    }
  }, [ticket]);

  async function fetchTicket() {
    try {
      const res = await fetch(`/api/tickets/${id}`);
      const data = await res.json();

      if (data.success) {
        setTicket(data.ticket);
      } else {
        setError(data.error || "Ticket not found");
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

  async function startJourney() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    if (!ticket) return;

    setActionLoading(true);
    setMessage("");
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const startLat = position.coords.latitude;
          const startLng = position.coords.longitude;
          
          setWorkerLocation({ lat: startLat, lng: startLng });

          // Generate route using the routing API
          const routeRes = await fetch(`/api/routes/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              startLat: startLat,
              startLon: startLng,
              endLat: ticket.pothole.latitude,
              endLon: ticket.pothole.longitude,
            }),
          });

          const routeData = await routeRes.json();

          if (!routeData.success) {
            setError(routeData.error || "Failed to generate route");
            setActionLoading(false);
            return;
          }

          // Update ticket status to IN_PROGRESS and store route data
          const statusRes = await fetch(`/api/tickets/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              status: "IN_PROGRESS",
              routeData: routeData.route,
            }),
          });

          const statusData = await statusRes.json();

          if (statusData.success) {
            setJourneyStarted(true);
            setMessage("Journey started! Route calculated.");
            fetchTicket();
          } else {
            setError(statusData.error || "Failed to update status");
          }
        } catch (err) {
          setError("Failed to start journey");
        } finally {
          setActionLoading(false);
        }
      },
      (error) => {
        setActionLoading(false);
        setError(`Location error: ${error.message}`);
      },
      { enableHighAccuracy: true }
    );
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
        <h2 className="text-xl font-bold mb-4">Pothole Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Location</label>
            <div>
              {ticket.pothole.latitude.toFixed(6)},{" "}
              {ticket.pothole.longitude.toFixed(6)}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-500">Road</label>
            <div>{ticket.pothole.roadInfo?.roadName || "Unknown"}</div>
          </div>
          <div>
            <label className="text-sm text-gray-500">Priority</label>
            <div>
              <span
                className={`px-2 py-1 rounded text-sm ${
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
                {ticket.pothole.priorityScore}/100
              </span>
            </div>
          </div>
        </div>
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

      {/* Route Map Section - Shows when journey is started or route data exists */}
      {(journeyStarted || ticket.routeData) && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            🗺️ Navigation Route
            {ticket.status === "IN_PROGRESS" && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded animate-pulse">
                LIVE
              </span>
            )}
          </h2>
          
          {/* Map */}
          <div className="h-[400px] rounded-lg overflow-hidden border mb-4">
            <TicketRouteMap
              workerLocation={workerLocation}
              potholeLocation={{
                lat: ticket.pothole.latitude,
                lng: ticket.pothole.longitude,
              }}
              priorityLevel={ticket.pothole.priorityLevel}
              routePolyline={ticket.routeData?.polyline}
              roadName={ticket.pothole.roadInfo?.roadName || undefined}
              ticketNumber={ticket.ticketNumber}
            />
          </div>

          {/* Route Stats */}
          {ticket.routeData && (
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <label className="text-sm text-gray-500 block">Distance</label>
                <div className="text-xl font-bold text-blue-600">
                  {(ticket.routeData.distance / 1000).toFixed(2)} km
                </div>
              </div>
              <div className="text-center border-x">
                <label className="text-sm text-gray-500 block">Est. Duration</label>
                <div className="text-xl font-bold text-blue-600">
                  {Math.round(ticket.routeData.duration / 60)} min
                </div>
              </div>
              <div className="text-center">
                <label className="text-sm text-gray-500 block">ETA</label>
                <div className="text-xl font-bold text-green-600">
                  {ticket.estimatedETA 
                    ? new Date(ticket.estimatedETA).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : "Calculating..."}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Start Journey Button - Shows when assigned but journey not started */}
      {ticket.assignedWorker && ticket.status === "ASSIGNED" && !journeyStarted && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-2 text-blue-900">🚀 Ready to Start</h2>
          <p className="text-blue-700 mb-4">
            Worker {ticket.assignedWorker.name} is assigned. Click below to start the journey and get navigation directions.
          </p>
          <button
            onClick={startJourney}
            disabled={actionLoading}
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-bold text-lg shadow-lg transition transform hover:scale-[1.02]"
          >
            {actionLoading ? "Getting Location..." : "🧭 Start Journey & Get Route"}
          </button>
        </div>
      )}

      {ticket.routeData && !journeyStarted && ticket.status !== "ASSIGNED" && (
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
            <h3 className="font-bold text-yellow-900 mb-3">🔍 Admin Review Required</h3>
            <p className="text-sm text-yellow-800 mb-4">
              The worker has submitted proof of completion. Please review and approve or reject.
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
