"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface WorkerDashboard {
  worker: {
    id: string;
    name: string;
    email: string;
    employeeId: string;
    currentLatitude: number | null;
    currentLongitude: number | null;
  };
  tasks: Array<{
    id: string;
    ticketNumber: string;
    status: string;
    pothole: {
      latitude: number;
      longitude: number;
      priorityLevel: string;
      priorityScore: number;
      roadInfo: {
        roadName: string | null;
      } | null;
    };
  }>;
}

export default function WorkerDashboardPage() {
  const params = useParams();
  const id = params.id as string;

  const [dashboard, setDashboard] = useState<WorkerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [locationForm, setLocationForm] = useState({
    latitude: "",
    longitude: "",
  });
  const [selectedTicket, setSelectedTicket] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, [id]);

  async function fetchDashboard() {
    try {
      setLoading(true);
      const res = await fetch(`/api/workers/${id}/tasks`);
      const data = await res.json();

      if (data.success) {
        setDashboard(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch worker dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function updateLocation(e: React.FormEvent) {
    e.preventDefault();
    try {
      setActionLoading(true);
      setMessage("");
      setError("");

      const res = await fetch(`/api/workers/${id}/location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: parseFloat(locationForm.latitude),
          longitude: parseFloat(locationForm.longitude),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Location updated successfully!");
        fetchDashboard();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to update location");
    } finally {
      setActionLoading(false);
    }
  }

  async function startJob() {
    if (!selectedTicket) return;

    try {
      setActionLoading(true);
      setMessage("");
      setError("");

      const res = await fetch(`/api/workers/${id}/start-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: selectedTicket }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(
          `Job started! ETA: ${Math.round(data.route.duration / 60)} minutes`,
        );
        fetchDashboard();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to start job");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!dashboard)
    return <div className="p-8 text-red-600">Worker not found</div>;

  const assignedTasks = dashboard.tasks.filter((t) => t.status === "ASSIGNED");
  const inProgressTasks = dashboard.tasks.filter(
    (t) => t.status === "IN_PROGRESS",
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/workers" className="text-blue-600 mb-4 inline-block">
        ← Back to Workers
      </Link>

      <h1 className="text-3xl font-bold mb-2">{dashboard.worker.name}</h1>
      <div className="text-gray-600 mb-6">
        {dashboard.worker.email} • {dashboard.worker.employeeId}
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
        <h2 className="text-xl font-bold mb-4">Current Location</h2>
        {dashboard.worker.currentLatitude &&
        dashboard.worker.currentLongitude ? (
          <div className="mb-4">
            <div className="text-lg">
              📍 {dashboard.worker.currentLatitude.toFixed(6)},{" "}
              {dashboard.worker.currentLongitude.toFixed(6)}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 mb-4">No location recorded</div>
        )}

        <form onSubmit={updateLocation} className="flex gap-2">
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={locationForm.latitude}
            onChange={(e) =>
              setLocationForm({ ...locationForm, latitude: e.target.value })
            }
            className="border rounded px-3 py-2 flex-1"
            required
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={locationForm.longitude}
            onChange={(e) =>
              setLocationForm({ ...locationForm, longitude: e.target.value })
            }
            className="border rounded px-3 py-2 flex-1"
            required
          />
          <button
            type="submit"
            disabled={actionLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Update Location
          </button>
        </form>
      </div>

      {assignedTasks.length > 0 && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Start Job</h2>
          <label className="block text-sm font-medium mb-2">
            Select Ticket to Start
          </label>
          <select
            value={selectedTicket}
            onChange={(e) => setSelectedTicket(e.target.value)}
            className="border rounded px-3 py-2 mb-4 w-full"
          >
            <option value="">-- Select a ticket --</option>
            {assignedTasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.ticketNumber} -{" "}
                {task.pothole.roadInfo?.roadName || "Unknown Road"} (
                {task.pothole.priorityLevel})
              </option>
            ))}
          </select>
          <button
            onClick={startJob}
            disabled={
              !selectedTicket ||
              actionLoading ||
              !dashboard.worker.currentLatitude
            }
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {actionLoading ? "Starting..." : "Start Job & Generate Route"}
          </button>
          {!dashboard.worker.currentLatitude && (
            <p className="text-sm text-gray-500 mt-2">Update location first</p>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            Assigned Tasks ({assignedTasks.length})
          </h2>
          {assignedTasks.length === 0 ? (
            <div className="text-gray-500">No assigned tasks</div>
          ) : (
            <div className="space-y-3">
              {assignedTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/tickets/${task.id}`}
                  className="block border rounded p-3 hover:bg-gray-50"
                >
                  <div className="font-mono text-sm">{task.ticketNumber}</div>
                  <div className="text-sm text-gray-600">
                    {task.pothole.roadInfo?.roadName || "Unknown Road"}
                  </div>
                  <div className="mt-1">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        task.pothole.priorityLevel === "CRITICAL"
                          ? "bg-red-100 text-red-800"
                          : task.pothole.priorityLevel === "HIGH"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.pothole.priorityLevel}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            In Progress ({inProgressTasks.length})
          </h2>
          {inProgressTasks.length === 0 ? (
            <div className="text-gray-500">No tasks in progress</div>
          ) : (
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/proof-upload/${task.id}`}
                  className="block border rounded p-3 hover:bg-gray-50"
                >
                  <div className="font-mono text-sm">{task.ticketNumber}</div>
                  <div className="text-sm text-gray-600">
                    {task.pothole.roadInfo?.roadName || "Unknown Road"}
                  </div>
                  <div className="mt-2 text-blue-600 text-sm">
                    → Upload Proof
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
