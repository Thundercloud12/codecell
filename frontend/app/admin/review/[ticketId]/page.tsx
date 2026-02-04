"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface TicketReview {
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
      roadType: string | null;
    } | null;
  };
  assignedWorker: {
    name: string;
    email: string;
  } | null;
  workProofs: Array<{
    id: string;
    imageUrls: string[];
    notes: string | null;
    submittedAt: string;
  }>;
}

export default function AdminReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.ticketId as string;

  const [ticket, setTicket] = useState<TicketReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  async function fetchTicket() {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/review/${ticketId}`);
      const data = await res.json();

      if (data.success) {
        setTicket(data.ticket);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch ticket");
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(action: "APPROVE" | "REJECT") {
    try {
      setActionLoading(true);
      setError("");

      const res = await fetch(`/api/admin/review/${ticketId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reviewedBy: "admin-user-id", // In production, get from auth context
          reviewNotes: reviewNotes || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/review");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(`Failed to ${action.toLowerCase()} ticket`);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!ticket) return <div className="p-8 text-red-600">Ticket not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/review" className="text-blue-600 mb-4 inline-block">
        ← Back to Review Queue
      </Link>

      <h1 className="text-3xl font-bold mb-2">{ticket.ticketNumber}</h1>
      <div className="mb-6">
        <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded font-semibold">
          {ticket.status}
        </span>
      </div>

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
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {ticket.pothole.priorityLevel}
              </span>
              <span className="ml-2 font-bold">
                {ticket.pothole.priorityScore}/100
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-500">Worker</label>
            <div>{ticket.assignedWorker?.name || "Unassigned"}</div>
          </div>
        </div>
      </div>

      {ticket.workProofs.map((proof) => (
        <div key={proof.id} className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Work Proof</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {proof.imageUrls.map((url, idx) => (
              <div key={idx} className="border rounded overflow-hidden">
                <img src={url} alt={`Proof ${idx + 1}`} className="w-full" />
              </div>
            ))}
          </div>

          {proof.notes && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Worker Notes
              </label>
              <div className="bg-gray-50 p-3 rounded">{proof.notes}</div>
            </div>
          )}

          <div className="text-sm text-gray-500">
            Submitted: {new Date(proof.submittedAt).toLocaleString()}
          </div>
        </div>
      ))}

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Review Decision</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Review Notes</label>
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Optional notes about your decision..."
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleReview("APPROVE")}
            disabled={actionLoading}
            className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {actionLoading ? "Processing..." : "✓ Approve & Resolve"}
          </button>
          <button
            onClick={() => handleReview("REJECT")}
            disabled={actionLoading}
            className="flex-1 bg-red-600 text-white py-3 rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            {actionLoading ? "Processing..." : "✗ Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}
