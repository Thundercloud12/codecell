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

  if (loading) return (
    <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center text-[#22C55E] font-mono animate-pulse">
      LOADING_TICKET_DATA...
    </div>
  );
  if (!ticket) return (
    <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center text-[#F87171] font-mono">
      ERROR: TICKET_NOT_FOUND
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-[#E5E7EB] p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/review" className="text-[#2DD4BF] mb-6 inline-flex items-center gap-2 hover:text-[#22C55E] transition font-mono text-sm uppercase tracking-wider">
          ← Return to Queue
        </Link>

        <div className="flex justify-between items-start mb-8 border-b border-[#1F2937] pb-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[#E5E7EB]">{ticket.ticketNumber}</h1>
            <span className="inline-block mt-2 px-4 py-2 bg-[#FBBF24]/10 border border-[#FBBF24]/50 text-[#FBBF24] rounded font-bold text-xs uppercase tracking-widest">
              {ticket.status}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-[#F87171]/10 border border-[#F87171] text-[#F87171] px-4 py-3 rounded mb-6 font-mono text-sm">
            CRITICAL_ERROR: {error}
          </div>
        )}

        <div className="bg-[#141B2A] border border-[#1F2937] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Hazard Data</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#9CA3AF] font-mono uppercase">Coordinates</label>
              <div className="font-mono text-[#2DD4BF]">
                {ticket.pothole.latitude.toFixed(6)}, {ticket.pothole.longitude.toFixed(6)}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#9CA3AF] font-mono uppercase">Sector</label>
              <div className="text-[#E5E7EB] uppercase font-bold">{ticket.pothole.roadInfo?.roadName || "Unknown"}</div>
            </div>
            <div>
              <label className="text-[10px] text-[#9CA3AF] font-mono uppercase">Severity</label>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded text-xs font-bold uppercase border ${
                    ticket.pothole.priorityLevel === "CRITICAL"
                      ? "bg-[#F87171]/10 text-[#F87171] border-[#F87171]/50"
                      : ticket.pothole.priorityLevel === "HIGH"
                        ? "bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/50"
                        : "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/50"
                  }`}
                >
                  {ticket.pothole.priorityLevel}
                </span>
                <span className="font-mono text-[#E5E7EB]">{ticket.pothole.priorityScore}/100</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#9CA3AF] font-mono uppercase">Assigned Unit</label>
              <div className="text-[#22C55E]">{ticket.assignedWorker?.name || "UNASSIGNED"}</div>
            </div>
          </div>
        </div>

        {ticket.workProofs.map((proof) => (
          <div key={proof.id} className="bg-[#141B2A] border border-[#1F2937] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Submitted Evidence</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {proof.imageUrls.map((url, idx) => (
                <div key={idx} className="border border-[#1F2937] rounded-lg overflow-hidden hover:border-[#22C55E] transition">
                  <img src={url} alt={`Proof ${idx + 1}`} className="w-full" />
                </div>
              ))}
            </div>

            {proof.notes && (
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-[#9CA3AF] uppercase mb-2">
                  Operative Notes
                </label>
                <div className="bg-[#0A0F1A] border border-[#1F2937] p-4 rounded text-[#E5E7EB]">{proof.notes}</div>
              </div>
            )}

            <div className="text-xs text-[#9CA3AF] font-mono">
              TIMESTAMP: {new Date(proof.submittedAt).toLocaleString()}
            </div>
          </div>
        ))}

        <div className="bg-[#141B2A] border border-[#1F2937] rounded-xl p-6">
          <h2 className="text-lg font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Admin Decision</h2>

          <div className="mb-6">
            <label className="block text-xs font-bold text-[#9CA3AF] uppercase mb-2">Review Notes</label>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full bg-[#0A0F1A] border border-[#1F2937] rounded-lg px-4 py-3 text-[#E5E7EB] focus:border-[#22C55E] focus:outline-none transition"
              rows={4}
              placeholder="Optional notes about your decision..."
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleReview("APPROVE")}
              disabled={actionLoading}
              className="flex-1 bg-[#22C55E] text-black py-4 rounded-lg hover:bg-[#22C55E]/80 disabled:bg-[#1F2937] disabled:text-[#9CA3AF] font-bold uppercase tracking-widest text-sm transition shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
            >
              {actionLoading ? "Processing..." : "✓ APPROVE & RESOLVE"}
            </button>
            <button
              onClick={() => handleReview("REJECT")}
              disabled={actionLoading}
              className="flex-1 bg-[#F87171] text-black py-4 rounded-lg hover:bg-[#F87171]/80 disabled:bg-[#1F2937] disabled:text-[#9CA3AF] font-bold uppercase tracking-widest text-sm transition"
            >
              {actionLoading ? "Processing..." : "✗ REJECT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
