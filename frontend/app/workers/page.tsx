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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    employeeId: "",
  });

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

  async function createWorker(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setShowCreateForm(false);
        setFormData({ name: "", email: "", phone: "", employeeId: "" });
        fetchWorkers();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to create worker");
    }
  }

  if (loading) return <div className="p-8">Loading workers...</div>;
  if (error && workers.length === 0)
    return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Workers</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showCreateForm ? "Cancel" : "Create Worker"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showCreateForm && (
        <form
          onSubmit={createWorker}
          className="bg-white border rounded-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold mb-4">Create New Worker</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Employee ID *
              </label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Worker
          </button>
        </form>
      )}

      {workers.length === 0 ? (
        <div className="text-gray-500">
          No workers found. Create one to get started.
        </div>
      ) : (
        <div className="grid gap-4">
          {workers.map((worker) => (
            <Link
              key={worker.id}
              href={`/workers/${worker.id}`}
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xl font-bold">{worker.name}</div>
                  <div className="text-sm text-gray-600">{worker.email}</div>
                  <div className="text-sm text-gray-600">
                    ID: {worker.employeeId}
                  </div>
                  {worker.currentLatitude && worker.currentLongitude && (
                    <div className="text-sm text-gray-500 mt-2">
                      📍 {worker.currentLatitude.toFixed(6)},{" "}
                      {worker.currentLongitude.toFixed(6)}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      worker.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {worker.isActive ? "Active" : "Inactive"}
                  </span>
                  <div className="mt-2 text-sm text-gray-600">
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
  );
}
