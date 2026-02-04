"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ReviewTicket {
  id: string;
  ticketNumber: string;
  status: string;
  potholes: Array<{
    id: string;
    latitude: number;
    longitude: number;
    roadInfo: {
      roadName: string | null;
    } | null;
  }>;
  assignedWorker: {
    name: string;
  } | null;
  workProofs: Array<{
    id: string;
    imageUrls: string[];
    notes: string | null;
    submittedAt: string;
  }>;
}

export default function AdminReviewPage() {
  const [tickets, setTickets] = useState<ReviewTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAwaitingVerification();
  }, []);

  async function fetchAwaitingVerification() {
    try {
      setLoading(true);
      const res = await fetch("/api/tickets?status=AWAITING_VERIFICATION");
      const data = await res.json();

      if (data.success) {
        setTickets(data.tickets);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <div className="p-8">Loading tickets awaiting review...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Review</h1>

      <div className="mb-4 text-gray-600">
        {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} awaiting
        verification
      </div>

      {tickets.length === 0 ? (
        <div className="text-gray-500">No tickets awaiting review</div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/admin/review/${ticket.id}`}
              className="border rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-mono text-lg font-bold mb-2">
                    {ticket.ticketNumber}
                  </div>
                  <div className="text-gray-600 mb-1">
                    {ticket.potholes.length > 0 && (
                      <>
                        {ticket.potholes[0].roadInfo?.roadName || "Unknown Road"}
                        {ticket.potholes.length > 1 && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            +{ticket.potholes.length - 1} more
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {ticket.potholes.length > 0 && (
                      <>
                        {ticket.potholes[0].latitude.toFixed(6)},{" "}
                        {ticket.potholes[0].longitude.toFixed(6)}
                      </>
                    )}
                  </div>
                  {ticket.assignedWorker && (
                    <div className="text-sm text-gray-600 mt-2">
                      Worker: {ticket.assignedWorker.name}
                    </div>
                  )}
                  {ticket.workProofs.length > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      Submitted:{" "}
                      {new Date(
                        ticket.workProofs[0].submittedAt,
                      ).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {ticket.workProofs[0]?.imageUrls
                    .slice(0, 2)
                    .map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Proof"
                        className="w-24 h-24 object-cover rounded border"
                      />
                    ))}
                </div>
              </div>

              <div className="mt-4 text-blue-600 font-semibold">
                → Review and Approve/Reject
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
