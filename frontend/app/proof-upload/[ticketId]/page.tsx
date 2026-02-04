"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ProofUploadPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.ticketId as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    imageUrls: [""],
    notes: "",
  });

  function addImageUrl() {
    setFormData({
      ...formData,
      imageUrls: [...formData.imageUrls, ""],
    });
  }

  function updateImageUrl(index: number, value: string) {
    const newUrls = [...formData.imageUrls];
    newUrls[index] = value;
    setFormData({ ...formData, imageUrls: newUrls });
  }

  function removeImageUrl(index: number) {
    const newUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, imageUrls: newUrls });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const validUrls = formData.imageUrls.filter((url) => url.trim() !== "");

      if (validUrls.length === 0) {
        setError("At least one image URL is required");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/tickets/${ticketId}/proof`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrls: validUrls,
          notes: formData.notes || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/tickets/${ticketId}`);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to upload proof");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        href={`/tickets/${ticketId}`}
        className="text-blue-600 mb-4 inline-block"
      >
        ← Back to Ticket
      </Link>

      <h1 className="text-3xl font-bold mb-6">Upload Work Proof</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> In a production system, you would upload images
          to Cloudinary/S3 first, then paste the URLs here. For testing, provide
          direct image URLs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Image URLs *</label>
          {formData.imageUrls.map((url, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => updateImageUrl(index, e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                placeholder="https://example.com/image.jpg"
                required
              />
              {formData.imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageUrl(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageUrl}
            className="text-blue-600 text-sm hover:underline"
          >
            + Add Another Image
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Describe the work completed..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Submit Proof"}
        </button>
      </form>
    </div>
  );
}
