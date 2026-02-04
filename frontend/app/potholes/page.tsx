"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Pothole {
  id: string;
  latitude: number;
  longitude: number;
  priorityScore: number | null;
  priorityLevel: string | null;
  createdAt: string;
  detection: {
    confidence: number;
  };
  roadInfo: {
    roadName: string | null;
    roadType: string | null;
  } | null;
  ticket: {
    id: string;
    ticketNumber: string;
    status: string;
  } | null;
}

export default function PotholesPage() {
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchPotholes();
  }, [filter]);

  async function fetchPotholes() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter) params.set("priorityLevel", filter);

      const res = await fetch(`/api/potholes?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setPotholes(data.potholes);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch potholes");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading potholes...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Potholes</h1>
        <Link
          href="/potholes/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Pothole
        </Link>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter("")}
          className={`px-4 py-2 rounded ${!filter ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("CRITICAL")}
          className={`px-4 py-2 rounded ${filter === "CRITICAL" ? "bg-red-600 text-white" : "bg-gray-200"}`}
        >
          Critical
        </button>
        <button
          onClick={() => setFilter("HIGH")}
          className={`px-4 py-2 rounded ${filter === "HIGH" ? "bg-orange-600 text-white" : "bg-gray-200"}`}
        >
          High
        </button>
        <button
          onClick={() => setFilter("MEDIUM")}
          className={`px-4 py-2 rounded ${filter === "MEDIUM" ? "bg-yellow-600 text-white" : "bg-gray-200"}`}
        >
          Medium
        </button>
        <button
          onClick={() => setFilter("LOW")}
          className={`px-4 py-2 rounded ${filter === "LOW" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Low
        </button>
      </div>

      {potholes.length === 0 ? (
        <div className="text-gray-500">No potholes found</div>
      ) : (
        <div className="grid gap-4">
          {potholes.map((pothole) => (
            <Link
              key={pothole.id}
              href={`/potholes/${pothole.id}`}
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-mono text-sm text-gray-500">
                    {pothole.id}
                  </div>
                  <div className="text-lg font-semibold mt-1">
                    {pothole.roadInfo?.roadName || "Unknown Road"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {pothole.latitude.toFixed(6)},{" "}
                    {pothole.longitude.toFixed(6)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Confidence:{" "}
                    {(pothole.detection.confidence * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="text-right">
                  {pothole.priorityLevel && (
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${
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
                  )}
                  {pothole.priorityScore !== null && (
                    <div className="text-2xl font-bold mt-2">
                      {pothole.priorityScore}
                    </div>
                  )}
                  {pothole.ticket && (
                    <div className="mt-2 text-sm">
                      <span className="text-blue-600">
                        {pothole.ticket.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
