"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Worker {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  isActive: boolean;
}

interface NearbyPothole {
  id: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  priorityLevel: string | null;
  priorityScore: number | null;
  detection: {
    confidence: number;
  };
  roadInfo: {
    roadName: string | null;
    roadType: string | null;
  } | null;
  distance?: number;
}

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  potholeId: string;
  onSuccess: () => void;
}

export default function CreateTicketModal({
  isOpen,
  onClose,
  potholeId,
  onSuccess,
}: CreateTicketModalProps) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [nearbyPotholes, setNearbyPotholes] = useState<NearbyPothole[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>("");
  const [selectedPotholeIds, setSelectedPotholeIds] = useState<string[]>([potholeId]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchWorkers();
      fetchNearbyPotholes();
      setSelectedPotholeIds([potholeId]);
    }
  }, [isOpen, potholeId]);

  async function fetchWorkers() {
    try {
      const res = await fetch("/api/workers");
      const data = await res.json();
      if (data.success) {
        setWorkers(data.workers.filter((w: Worker) => w.isActive));
      }
    } catch (err) {
      console.error("Failed to fetch workers:", err);
    }
  }

  async function fetchNearbyPotholes() {
    try {
      const res = await fetch(`/api/potholes/${potholeId}/nearby`);
      const data = await res.json();
      if (data.success) {
        setNearbyPotholes(data.potholes);
      }
    } catch (err) {
      console.error("Failed to fetch nearby potholes:", err);
    }
  }

  function togglePotholeSelection(id: string, e?: React.MouseEvent) {
    if (e) {
      e.stopPropagation();
    }
    setSelectedPotholeIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tickets/create-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          potholeIds: selectedPotholeIds,
          assignedWorkerId: selectedWorkerId || null,
          notes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || "Failed to create ticket");
      }
    } catch (err) {
      setError("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative" style={{ zIndex: 10000 }}>
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold">Create Work Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Worker Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assign to Worker (Optional)
            </label>
            <select
              value={selectedWorkerId}
              onChange={(e) => setSelectedWorkerId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Worker Later --</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name} ({worker.employeeId}) - {worker.email}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Leave unassigned to assign later from ticket management
            </p>
          </div>

          {/* Potholes in Same Route */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Include Potholes in Same Route
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {nearbyPotholes.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No other potholes found in this route
                  </p>
                ) : (
                  nearbyPotholes.map((pothole) => (
                    <div
                      key={pothole.id}
                      className={`border rounded-lg p-3 transition ${
                        selectedPotholeIds.includes(pothole.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedPotholeIds.includes(pothole.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            togglePotholeSelection(pothole.id);
                          }}
                          className="mt-1 cursor-pointer"
                        />
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => togglePotholeSelection(pothole.id)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">
                              {pothole.id.slice(0, 8)}
                            </span>
                            {pothole.distance && (
                              <span className="text-xs text-gray-600">
                                {pothole.distance.toFixed(0)}m away
                              </span>
                            )}
                            {pothole.priorityLevel && (
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  pothole.priorityLevel === "HIGH"
                                    ? "bg-orange-100 text-orange-800"
                                    : pothole.priorityLevel === "MEDIUM"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {pothole.priorityLevel}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-700">
                            {pothole.roadInfo?.roadName || "Unknown Road"} (
                            {pothole.roadInfo?.roadType || "Unknown"})
                          </div>
                          <div className="text-xs text-gray-500">
                            Confidence: {(pothole.detection.confidence * 100).toFixed(1)}%
                            {pothole.priorityScore && ` | Score: ${pothole.priorityScore.toFixed(1)}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selected: {selectedPotholeIds.length} pothole(s)
            </p>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional notes or instructions..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              disabled={loading || selectedPotholeIds.length === 0}
            >
              {loading ? "Creating..." : `Create Ticket (${selectedPotholeIds.length} pothole${selectedPotholeIds.length > 1 ? "s" : ""})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
