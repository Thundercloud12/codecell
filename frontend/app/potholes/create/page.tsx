"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePotholePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    detectionId: "",
    latitude: "",
    longitude: "",
    imageUrl: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/potholes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          detectionId: formData.detectionId,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          imageUrl: formData.imageUrl || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/potholes/${data.pothole.id}`);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to create pothole");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/potholes" className="text-blue-600 mb-4 inline-block">
        ← Back
      </Link>

      <h1 className="text-3xl font-bold mb-6">Create Pothole</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Detection ID *
          </label>
          <input
            type="text"
            value={formData.detectionId}
            onChange={(e) =>
              setFormData({ ...formData, detectionId: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            required
            placeholder="UUID of existing detection"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Latitude *</label>
          <input
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) =>
              setFormData({ ...formData, latitude: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            required
            placeholder="19.0760"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Longitude *</label>
          <input
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) =>
              setFormData({ ...formData, longitude: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            required
            placeholder="72.8777"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Image URL (optional)
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Pothole"}
        </button>
      </form>
    </div>
  );
}
