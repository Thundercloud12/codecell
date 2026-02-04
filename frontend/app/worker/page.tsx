"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import map component
const SimpleWorkerNav = dynamic(() => import("@/components/SimpleWorkerNav"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-white rounded-xl flex items-center justify-center border-2 border-[#E5E1D8]">
      <div className="text-[#1E3A5F] font-medium">Loading navigation...</div>
    </div>
  ),
});

interface Pothole {
  id: string;
  latitude: number;
  longitude: number;
  priorityLevel: string | null;
  priorityScore: number | null;
  imageUrl: string | null;
  roadInfo: {
    roadName: string | null;
    roadType: string | null;
  } | null;
}

interface Task {
  id: string;
  ticketNumber: string;
  status: string;
  assignedAt: string | null;
  potholes: Pothole[];
  workProofs: Array<{
    id: string;
    submittedAt: string;
    isApproved: boolean | null;
  }>;
}

interface WorkerData {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  currentLatitude: number | null;
  currentLongitude: number | null;
}

export default function WorkerDashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState<WorkerData | null>(null);
  const [workerLocation, setWorkerLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState("");
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [uploadingProof, setUploadingProof] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchWorkerData();
      requestLocation();
    }
  }, [isLoaded, user]);

  function requestLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setWorkerLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError("");
        },
        (error) => {
          setLocationError(
            "Location access denied. Please enable location to use navigation.",
          );
          console.error("Location error:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  }

  async function fetchWorkerData() {
    if (!user?.primaryEmailAddress?.emailAddress) {
      setLoading(false);
      setError("No email address found for your account");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // First, try to find the worker by email
      const workerRes = await fetch("/api/workers");
      const workerData = await workerRes.json();

      if (!workerData.success) {
        setError("Failed to fetch worker data");
        setLoading(false);
        return;
      }

      const matchedWorker = workerData.workers.find(
        (w: WorkerData) =>
          w.email.toLowerCase() ===
          user.primaryEmailAddress!.emailAddress.toLowerCase(),
      );

      if (!matchedWorker) {
        setError(
          "No worker profile linked to your account. Please contact an administrator.",
        );
        setLoading(false);
        return;
      }

      setWorker(matchedWorker);

      // Now fetch tasks for this worker
      const tasksRes = await fetch(`/api/workers/${matchedWorker.id}/tasks`);
      const tasksData = await tasksRes.json();

      if (tasksData.success) {
        setTasks(tasksData.tasks || []);
      } else {
        setError(tasksData.error || "Failed to fetch tasks");
      }
    } catch (err) {
      console.error("Failed to fetch worker data:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }

  async function updateLocation() {
    if (!worker || !workerLocation) return;

    try {
      setActionLoading(true);
      const res = await fetch(`/api/workers/${worker.id}/location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: workerLocation.latitude,
          longitude: workerLocation.longitude,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWorker((prev) =>
          prev
            ? {
                ...prev,
                currentLatitude: workerLocation.latitude,
                currentLongitude: workerLocation.longitude,
              }
            : null,
        );
      }
    } catch (err) {
      console.error("Failed to update location:", err);
    } finally {
      setActionLoading(false);
    }
  }

  async function startJob(ticketId: string) {
    if (!worker) return;

    try {
      setActionLoading(true);
      const res = await fetch(`/api/workers/${worker.id}/start-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchWorkerData();
      } else {
        alert(data.error || "Failed to start job");
      }
    } catch (err) {
      console.error("Failed to start job:", err);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleProofUpload(ticketId: string, file: File) {
    if (!worker) return;

    try {
      setUploadingProof(ticketId);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload/proof", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        throw new Error(uploadData.error || "Upload failed");
      }

      // Submit proof
      const proofRes = await fetch(`/api/tickets/${ticketId}/proof`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrls: [uploadData.fileUrl || uploadData.cloudinaryUrl],
          notes: "Work completed",
          latitude: workerLocation?.latitude,
          longitude: workerLocation?.longitude,
        }),
      });
      const proofData = await proofRes.json();

      if (proofData.success) {
        alert("Proof uploaded! Awaiting admin verification.");
        fetchWorkerData();
      } else {
        throw new Error(proofData.error || "Failed to submit proof");
      }
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploadingProof(null);
    }
  }

  const taskStats = {
    assigned: tasks.filter((t) => t.status === "ASSIGNED").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    awaiting: tasks.filter((t) => t.status === "AWAITING_VERIFICATION").length,
  };

  const getPriorityColor = (level: string | null) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-100 text-red-700";
      case "HIGH":
        return "bg-orange-100 text-orange-700";
      case "MEDIUM":
        return "bg-amber-100 text-amber-700";
      case "LOW":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-700";
      case "AWAITING_VERIFICATION":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1E3A5F] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#1E3A5F] font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F]">
      {/* Header */}
      <nav className="bg-[#1E3A5F] shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#1E3A5F] font-bold text-lg">
              W
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Field Worker Dashboard
              </h1>
              <p className="text-xs text-[#A8C5E2]">
                {worker?.name || user?.firstName || "Worker"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {worker && (
              <span className="text-xs text-[#A8C5E2] bg-[#2A4A6F] px-3 py-1 rounded-full">
                ID: {worker.employeeId}
              </span>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-bold text-[#C62828]">Error</div>
                <div className="text-sm text-[#C62828]/70">{error}</div>
              </div>
            </div>
            <button
              onClick={fetchWorkerData}
              className="mt-4 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2A4A6F] transition text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Location Status */}
        {workerLocation ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              <div>
                <div className="font-bold text-green-700 text-sm">
                  GPS Tracking Active
                </div>
                <div className="text-xs text-green-600">
                  Lat: {workerLocation.latitude.toFixed(6)} | Lng:{" "}
                  {workerLocation.longitude.toFixed(6)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={requestLocation}
                className="text-xs text-green-700 hover:text-green-900 font-medium px-3 py-1 border border-green-300 rounded-lg hover:bg-green-100 transition"
              >
                Refresh
              </button>
              <button
                onClick={updateLocation}
                disabled={actionLoading}
                className="text-xs bg-green-600 text-white font-medium px-3 py-1 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {actionLoading ? "Syncing..." : "Sync to Server"}
              </button>
            </div>
          </div>
        ) : locationError ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <div className="font-bold text-[#C62828] text-sm">
                ⚠️ GPS Signal Lost
              </div>
              <div className="text-xs text-[#C62828]/70">{locationError}</div>
            </div>
            <button
              onClick={requestLocation}
              className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2A4A6F] transition text-xs font-medium"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-white border-2 border-[#E5E1D8] rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#1E3A5F] border-t-transparent"></div>
              <span className="text-[#5A6C7D] text-sm">
                Acquiring GPS signal...
              </span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: "📋",
              label: "Assigned",
              val: taskStats.assigned,
              color: "text-blue-700",
              bg: "bg-blue-50",
              border: "border-blue-200",
            },
            {
              icon: "⚙️",
              label: "In Progress",
              val: taskStats.inProgress,
              color: "text-purple-700",
              bg: "bg-purple-50",
              border: "border-purple-200",
            },
            {
              icon: "⏳",
              label: "Awaiting Review",
              val: taskStats.awaiting,
              color: "text-amber-700",
              bg: "bg-amber-50",
              border: "border-amber-200",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`${stat.bg} p-5 rounded-xl border-2 ${stat.border}`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-xs text-[#5A6C7D] mb-1">{stat.label}</div>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.val}
              </div>
            </div>
          ))}
        </div>

        {/* No Worker Profile */}
        {!worker && !error && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-8 text-center">
            <p className="text-amber-700 font-bold mb-2 text-lg">
              ⚠️ Profile Not Linked
            </p>
            <p className="text-sm text-[#5A6C7D]">
              Your account is not linked to a worker profile.
            </p>
            <p className="text-sm text-[#5A6C7D]">
              Contact an administrator to get assigned.
            </p>
          </div>
        )}

        {/* Tasks Section */}
        {worker && tasks.length === 0 && (
          <div className="bg-white rounded-xl border-2 border-[#E5E1D8] p-12 text-center shadow-sm">
            <div className="text-6xl mb-6 opacity-30">📡</div>
            <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">
              No Active Tasks
            </h3>
            <p className="text-[#5A6C7D]">
              Standby for new assignments from admin.
            </p>
            <button
              onClick={fetchWorkerData}
              className="mt-6 px-6 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2A4A6F] transition text-sm font-medium"
            >
              Check for Updates
            </button>
          </div>
        )}

        {worker && tasks.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#1E3A5F] flex items-center gap-3">
              <span className="w-1 h-6 bg-[#1E3A5F] rounded-full"></span>
              My Tasks
              <span className="text-xs text-[#5A6C7D] font-normal py-1 px-3 bg-white border border-[#E5E1D8] rounded-full">
                {tasks.length} Active
              </span>
              <button
                onClick={fetchWorkerData}
                className="ml-auto text-xs text-[#1E3A5F] font-medium hover:underline"
              >
                ↻ Refresh
              </button>
            </h2>

            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white border-2 border-[#E5E1D8] rounded-xl overflow-hidden hover:border-[#1E3A5F] transition shadow-sm"
              >
                {/* Task Header */}
                <div className="p-5 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-lg font-bold text-[#1E3A5F]">
                        {task.ticketNumber}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.potholes[0]?.priorityLevel)}`}
                      >
                        {task.potholes[0]?.priorityLevel || "UNRANKED"}
                      </span>
                    </div>
                    <div className="text-sm text-[#5A6C7D]">
                      📍{" "}
                      {task.potholes[0]?.roadInfo?.roadName || "Unknown Road"}
                      {task.potholes[0]?.roadInfo?.roadType && (
                        <span className="text-xs text-[#5A6C7D]/70">
                          {" "}
                          ({task.potholes[0].roadInfo.roadType})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#5A6C7D] mt-1">
                      Coords: {task.potholes[0]?.latitude?.toFixed(6) || "N/A"},{" "}
                      {task.potholes[0]?.longitude?.toFixed(6) || "N/A"}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setExpandedTask(expandedTask === task.id ? null : task.id)
                    }
                    className="text-[#1E3A5F] hover:text-[#2A4A6F] transition p-2"
                  >
                    {expandedTask === task.id ? "▲" : "▼"}
                  </button>
                </div>

                {/* Expanded Content */}
                {expandedTask === task.id && (
                  <div className="border-t-2 border-[#E5E1D8] p-5 space-y-4 bg-[#F8F6F1]">
                    {/* Navigation Map */}
                    {workerLocation && task.potholes[0] && (
                      <div className="rounded-xl overflow-hidden border-2 border-[#E5E1D8]">
                        <SimpleWorkerNav
                          workerLocation={workerLocation}
                          potholeLocation={{
                            latitude: task.potholes[0].latitude,
                            longitude: task.potholes[0].longitude,
                          }}
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {task.status === "ASSIGNED" && (
                        <button
                          onClick={() => startJob(task.id)}
                          disabled={actionLoading}
                          className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {actionLoading ? "⏳ Starting..." : "🚀 Start Job"}
                        </button>
                      )}

                      {task.status === "IN_PROGRESS" && (
                        <label className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-700 transition cursor-pointer flex items-center justify-center gap-2">
                          {uploadingProof === task.id ? (
                            <>⏳ Uploading...</>
                          ) : (
                            <>📸 Upload Proof</>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleProofUpload(task.id, file);
                            }}
                            disabled={uploadingProof === task.id}
                          />
                        </label>
                      )}

                      {task.status === "AWAITING_VERIFICATION" && (
                        <div className="flex-1 bg-amber-100 text-amber-700 px-4 py-3 rounded-xl font-medium text-center border-2 border-amber-200">
                          ⏳ Awaiting Admin Review
                        </div>
                      )}

                      {task.potholes[0] && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${task.potholes[0].latitude},${task.potholes[0].longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#1E3A5F] text-white px-4 py-3 rounded-xl font-medium hover:bg-[#2A4A6F] transition flex items-center gap-2"
                        >
                          🗺️ Open in Maps
                        </a>
                      )}
                    </div>

                    {/* Proof History */}
                    {task.workProofs.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-[#E5E1D8]">
                        <div className="text-xs text-[#5A6C7D] mb-2">
                          Submitted Proofs
                        </div>
                        {task.workProofs.map((proof) => (
                          <div
                            key={proof.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span
                              className={
                                proof.isApproved === true
                                  ? "text-green-600"
                                  : proof.isApproved === false
                                    ? "text-red-600"
                                    : "text-amber-600"
                              }
                            >
                              {proof.isApproved === true
                                ? "✓"
                                : proof.isApproved === false
                                  ? "✗"
                                  : "⏳"}
                            </span>
                            <span className="text-[#5A6C7D]">
                              {new Date(proof.submittedAt).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
