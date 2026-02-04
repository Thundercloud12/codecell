"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import map component (Leaflet requires browser environment)
const WorkerNavigationMap = dynamic(
  () => import("@/components/WorkerNavigationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] bg-[#F8F6F1] animate-pulse rounded-lg flex items-center justify-center border border-[#D4D1C8]">
        <span className="text-[#5A6C7D] font-mono">Loading map...</span>
      </div>
    ),
  },
);

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
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, [id]);

  // Get current location using browser GPS
  function getCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    setError("");
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationForm({
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        });
        setMessage("Location fetched! Click 'Update Location' to save.");
        setGettingLocation(false);
      },
      (err) => {
        setGettingLocation(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              "Location permission denied. Please allow location access.",
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out.");
            break;
          default:
            setError("An error occurred while getting location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  // Auto-fetch and submit location in one click
  async function fetchAndUpdateLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    setError("");
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLocationForm({
          latitude: lat.toString(),
          longitude: lng.toString(),
        });

        try {
          const res = await fetch(`/api/workers/${id}/location`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: lat,
              longitude: lng,
              accuracy: position.coords.accuracy,
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
          setGettingLocation(false);
        }
      },
      (err) => {
        setGettingLocation(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              "Location permission denied. Please allow location access.",
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out.");
            break;
          default:
            setError("An error occurred while getting location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  async function fetchDashboard() {
    try {
      setLoading(true);
      const res = await fetch(`/api/workers/${id}/tasks`);
      const data = await res.json();

      console.log("=== DASHBOARD DATA RECEIVED ===");
      console.log("Full response:", JSON.stringify(data, null, 2));
      console.log("Tasks:", data.tasks);
      if (data.tasks && data.tasks.length > 0) {
        console.log("First task:", JSON.stringify(data.tasks[0], null, 2));
        console.log("First task potholes:", data.tasks[0].potholes);
      }
      console.log("===============================");

      if (data.success) {
        setDashboard(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
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

      // Get the selected task and its first pothole
      const task = dashboard?.tasks.find((t) => t.id === selectedTicket);
      const pothole = task?.potholes[0];

      if (
        !pothole ||
        !dashboard?.worker.currentLatitude ||
        !dashboard?.worker.currentLongitude
      ) {
        setError("Missing location data");
        setActionLoading(false);
        return;
      }

      // Calculate route using Dijkstra algorithm
      const routeRes = await fetch("/api/route/dijkstra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerLat: dashboard.worker.currentLatitude,
          workerLng: dashboard.worker.currentLongitude,
          potholeLat: pothole.latitude,
          potholeLng: pothole.longitude,
        }),
      });

      const routeData = await routeRes.json();

      if (!routeData.success) {
        setError(routeData.error || "Failed to calculate route");
        setActionLoading(false);
        return;
      }

      // Start the job with route data
      const res = await fetch(`/api/workers/${id}/start-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket,
          route: routeData,
        }),
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

  if (loading)
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center text-[#2E7D32] font-mono animate-pulse">
        LOADING_AGENT_PROFILE...
      </div>
    );
  if (!dashboard)
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center text-[#D32F2F] font-mono">
        AGENT_NOT_FOUND
      </div>
    );

  const assignedTasks = dashboard.tasks.filter((t) => t.status === "ASSIGNED");
  const inProgressTasks = dashboard.tasks.filter(
    (t) => t.status === "IN_PROGRESS",
  );

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/workers"
          className="text-[#1565C0] mb-8 inline-flex items-center gap-2 hover:text-[#2E7D32] transition font-mono text-sm uppercase tracking-wider"
        >
          ← Back to Workers
        </Link>

        <div className="mb-8 pb-6 border-b border-[#D4D1C8]">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-3">
            <span className="bg-gradient-to-r from-[#2E7D32] to-[#1565C0] text-transparent bg-clip-text">
              {dashboard.worker.name}
            </span>
          </h1>
          <div className="text-[#5A6C7D] font-mono text-sm">
            {dashboard.worker.email} • {dashboard.worker.employeeId}
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
            Current Location
          </h2>
          {dashboard.worker.currentLatitude &&
          dashboard.worker.currentLongitude ? (
            <div className="mb-4">
              <div className="text-lg font-mono text-[#1565C0]">
                📍 {dashboard.worker.currentLatitude.toFixed(6)},{" "}
                {dashboard.worker.currentLongitude.toFixed(6)}
              </div>
            </div>
          ) : (
            <div className="text-[#5A6C7D] mb-4 font-mono">
              No location recorded
            </div>
          )}

          {/* Quick GPS Update Button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={fetchAndUpdateLocation}
              disabled={gettingLocation || actionLoading}
              className="w-full bg-[#2E7D32] text-white px-4 py-3 rounded-lg hover:bg-[#2E7D32]/90 disabled:bg-[#D4D1C8] disabled:text-[#5A6C7D] flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition"
            >
              {gettingLocation ? (
                <>
                  <span className="animate-spin">⏳</span> Getting Location...
                </>
              ) : (
                <>📍 Use My Current Location (GPS)</>
              )}
            </button>
            <p className="text-xs text-[#5A6C7D] mt-2 text-center">
              Automatically fetches and saves your GPS location
            </p>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D4D1C8]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-[#5A6C7D]">
                OR enter manually
              </span>
            </div>
          </div>

          <form onSubmit={updateLocation} className="flex gap-2">
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={locationForm.latitude}
              onChange={(e) =>
                setLocationForm({ ...locationForm, latitude: e.target.value })
              }
              className="border border-[#D4D1C8] rounded-lg px-4 py-2 flex-1 focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 transition"
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
              className="border border-[#D4D1C8] rounded-lg px-4 py-2 flex-1 focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 transition"
              required
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="bg-[#F8F6F1] text-[#1E3A5F] border border-[#D4D1C8] px-3 py-2 rounded-lg hover:bg-[#E5E1D8] disabled:bg-[#F8F6F1] transition"
              title="Fill with GPS coordinates"
            >
              {gettingLocation ? "⏳" : "🎯"}
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="bg-[#1565C0] text-white px-6 py-2 rounded-lg hover:bg-[#1565C0]/90 disabled:bg-[#D4D1C8] disabled:text-[#5A6C7D] font-bold uppercase tracking-wider transition"
            >
              Update Location
            </button>
          </form>
        </div>

        {assignedTasks.length > 0 && (
          <div className="bg-white border border-[#D4D1C8] rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1E3A5F] mb-4 uppercase tracking-wide">
              Start Job
            </h2>
            <label className="block text-sm font-bold text-[#5A6C7D] uppercase mb-2">
              Select Ticket to Start
            </label>
            <select
              value={selectedTicket}
              onChange={(e) => setSelectedTicket(e.target.value)}
              className="border border-[#D4D1C8] rounded-lg px-4 py-3 mb-4 w-full focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 transition"
            >
              <option value="">-- Select a ticket --</option>
              {assignedTasks.map((task) => {
                const primaryPothole = task.potholes[0];
                return (
                  <option key={task.id} value={task.id}>
                    {task.ticketNumber} -{" "}
                    {primaryPothole?.roadInfo?.roadName || "Unknown Road"} (
                    {primaryPothole?.priorityLevel})
                    {task.potholes.length > 1
                      ? ` +${task.potholes.length - 1} more`
                      : ""}
                  </option>
                );
              })}
            </select>
            <button
              onClick={startJob}
              disabled={
                !selectedTicket ||
                actionLoading ||
                !dashboard.worker.currentLatitude
              }
              className="bg-[#2E7D32] text-white px-6 py-3 rounded-lg hover:bg-[#2E7D32]/90 disabled:bg-[#D4D1C8] disabled:text-[#5A6C7D] font-bold uppercase tracking-wider transition"
            >
              {actionLoading ? "Starting..." : "Start Job & Generate Route"}
            </button>
            {!dashboard.worker.currentLatitude && (
              <p className="text-sm text-[#D32F2F] mt-2 font-mono">
                Update location first
              </p>
            )}
          </div>
        )}

        {/* Navigation Map Section */}
        <div className="bg-white border border-[#D4D1C8] rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#1E3A5F] mb-4 uppercase tracking-wide">
            🗺️ Navigation Map
          </h2>
          <p className="text-sm text-[#5A6C7D] mb-4">
            View all assigned potholes on the map. Click &quot;Navigate&quot; to
            get directions from your current location.
          </p>
          <WorkerNavigationMap
            potholes={[...assignedTasks, ...inProgressTasks]}
            workerLocation={
              dashboard.worker.currentLatitude &&
              dashboard.worker.currentLongitude
                ? {
                    lat: dashboard.worker.currentLatitude,
                    lng: dashboard.worker.currentLongitude,
                  }
                : null
            }
            onNavigate={(pothole, routeInfo) => {
              setMessage(
                `Route to ${pothole.ticketNumber}: ${(routeInfo.distance / 1000).toFixed(1)} km, ~${Math.round(routeInfo.time / 60)} min`,
              );
            }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white border border-[#D4D1C8] rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1E3A5F] mb-4 uppercase tracking-wide">
              Assigned Tasks ({assignedTasks.length})
            </h2>
            {assignedTasks.length === 0 ? (
              <div className="text-[#5A6C7D] font-mono">No assigned tasks</div>
            ) : (
              <div className="space-y-3">
                {assignedTasks.map((task) => {
                  const primaryPothole = task.potholes[0];
                  return (
                    <Link
                      key={task.id}
                      href={`/tickets/${task.id}`}
                      className="block border border-[#D4D1C8] rounded-lg p-3 hover:border-[#1565C0] hover:shadow-md transition"
                    >
                      <div className="font-mono text-sm text-[#1565C0]">
                        {task.ticketNumber}
                        {task.potholes.length > 1 && (
                          <span className="ml-2 text-xs text-[#5A6C7D]">
                            ({task.potholes.length} sites)
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-[#1E3A5F] font-semibold">
                        {primaryPothole?.roadInfo?.roadName || "Unknown Road"}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                            primaryPothole?.priorityLevel === "CRITICAL"
                              ? "bg-[#D32F2F]/10 text-[#D32F2F] border-[#D32F2F]/30"
                              : primaryPothole?.priorityLevel === "HIGH"
                                ? "bg-[#F57C00]/10 text-[#F57C00] border-[#F57C00]/30"
                                : "bg-[#FBC02D]/10 text-[#F57C00] border-[#FBC02D]/30"
                          }`}
                        >
                          {primaryPothole?.priorityLevel}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white border border-[#D4D1C8] rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1E3A5F] mb-4 uppercase tracking-wide">
              In Progress ({inProgressTasks.length})
            </h2>
            {inProgressTasks.length === 0 ? (
              <div className="text-[#5A6C7D] font-mono">
                No tasks in progress
              </div>
            ) : (
              <div className="space-y-3">
                {inProgressTasks.map((task) => {
                  const primaryPothole = task.potholes[0];
                  return (
                    <Link
                      key={task.id}
                      href={`/proof-upload/${task.id}`}
                      className="block border border-[#D4D1C8] rounded-lg p-3 hover:border-[#2E7D32] hover:shadow-md transition"
                    >
                      <div className="font-mono text-sm text-[#1565C0]">
                        {task.ticketNumber}
                        {task.potholes.length > 1 && (
                          <span className="ml-2 text-xs text-[#5A6C7D]">
                            ({task.potholes.length} sites)
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-[#1E3A5F] font-semibold">
                        {primaryPothole?.roadInfo?.roadName || "Unknown Road"}
                      </div>
                      <div className="mt-2 text-[#2E7D32] text-sm font-semibold">
                        → Upload Proof
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}