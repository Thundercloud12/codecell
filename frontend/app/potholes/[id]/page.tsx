"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues
const PotholeLocationMap = dynamic(
  () => import("@/components/PotholeLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-white rounded-xl border border-[#D4D1C8] flex items-center justify-center">
        <div className="text-[#2E7D32] font-mono animate-pulse">
          INITIALIZING_SAT_UPLINK...
        </div>
      </div>
    ),
  },
);

const WorkerAssignmentModal = dynamic(
  () => import("@/components/WorkerAssignmentModal"),
  {
    ssr: false,
  },
);

const NearbyPotholesSelection = dynamic(
  () => import("@/components/NearbyPotholesSelection"),
  {
    ssr: false,
  },
);

interface PotholeDetail {
  id: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  priorityScore: number | null;
  priorityLevel: string | null;
  detection: {
    id: string;
    confidence: number;
    bboxX: number;
    bboxY: number;
    bboxWidth: number;
    bboxHeight: number;
    media: {
      mediaUrl: string;
    };
  };
  roadInfo: {
    roadName: string | null;
    roadType: string | null;
    speedLimit: number | null;
    trafficImportance: number;
    priorityFactor: number;
  } | null;
  ticket: {
    id: string;
    ticketNumber: string;
    status: string;
  } | null;
}

export default function PotholeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [pothole, setPothole] = useState<PotholeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [showNearbyPotholes, setShowNearbyPotholes] = useState(false);
  const [selectedNearbyPotholeIds, setSelectedNearbyPotholeIds] = useState<
    string[]
  >([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    fetchPothole();
  }, [id]);

  useEffect(() => {
    if (pothole && imgRef.current && canvasRef.current) {
      drawBoundingBox();
    }
  }, [pothole]);

  function drawBoundingBox() {
    if (!pothole || !imgRef.current || !canvasRef.current) return;

    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    // Draw the image
    ctx.drawImage(img, 0, 0);

    // Draw bounding box
    const { bboxX, bboxY, bboxWidth, bboxHeight, confidence } =
      pothole.detection;

    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 4;
    ctx.strokeRect(bboxX, bboxY, bboxWidth, bboxHeight);

    // Draw confidence label
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(bboxX, bboxY - 30, 150, 30);
    ctx.fillStyle = "#000";
    ctx.font = "bold 16px Arial";
    ctx.fillText(
      `${(confidence * 100).toFixed(1)}% Pothole`,
      bboxX + 5,
      bboxY - 8,
    );
  }

  async function fetchPothole() {
    try {
      const res = await fetch(`/api/potholes/${id}`);
      const data = await res.json();

      if (data.success) {
        setPothole(data.pothole);
      } else {
        setError(data.error || "Pothole not found");
      }
    } catch (err) {
      setError("Failed to fetch pothole");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRoadInfo() {
    try {
      setActionLoading(true);
      setMessage("");
      setError("");

      const res = await fetch(`/api/road-info/${id}`, { method: "POST" });
      const data = await res.json();

      if (data.success) {
        setMessage("Road info fetched successfully!");
        fetchPothole();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch road info");
    } finally {
      setActionLoading(false);
    }
  }

  async function calculateRanking() {
    try {
      setActionLoading(true);
      setMessage("");
      setError("");

      const res = await fetch(`/api/rank/${id}`, { method: "POST" });
      const data = await res.json();

      if (data.success) {
        setMessage(
          `Priority calculated: ${data.ranking.level} (${data.ranking.score}/100)`,
        );
        fetchPothole();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to calculate ranking");
    } finally {
      setActionLoading(false);
    }
  }

  async function createTicket() {
    try {
      setActionLoading(true);
      setMessage("");
      setError("");

      // Include the source pothole and any selected nearby potholes
      const potholeIds = [id, ...selectedNearbyPotholeIds];

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          potholeIds,
          notes:
            selectedNearbyPotholeIds.length > 0
              ? `Ticket includes ${potholeIds.length} potholes on the same route`
              : undefined,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage(
          `Ticket created: ${data.ticket.ticketNumber}${
            data.potholeCount > 1 ? ` (${data.potholeCount} potholes)` : ""
          }`,
        );
        setCreatedTicketId(data.ticket.id);
        setShowWorkerModal(true);
        setShowNearbyPotholes(false);
        setSelectedNearbyPotholeIds([]);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to create ticket");
    } finally {
      setActionLoading(false);
    }
  }

  function handleWorkerAssignmentSuccess() {
    setShowWorkerModal(false);
    setMessage("Worker(s) assigned successfully!");
    fetchPothole();
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center text-[#2E7D32] font-mono animate-pulse">
        ACCESSING_SECURE_RECORDS...
      </div>
    );
  if (!pothole)
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center text-[#D32F2F] font-mono">
        ERROR_404: RECORD_MISSING_OR_CORRUPTED
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F] p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/potholes"
          className="text-[#1565C0] mb-8 inline-flex items-center gap-2 hover:text-[#2E7D32] transition font-mono text-sm uppercase tracking-wider"
        >
          ← Return to Registry
        </Link>

        <div className="flex justify-between items-start mb-8 border-b border-[#D4D1C8] pb-6">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
              Hazard
              <span className="bg-gradient-to-r from-[#2E7D32] to-[#1565C0] text-transparent bg-clip-text">
                Profile
              </span>
            </h1>
            <p className="text-[#5A6C7D] font-mono text-xs">
              RECORD_ID: {pothole.id}
            </p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-[#5A6C7D] text-[10px] font-mono uppercase">
              System Status
            </div>
            <div className="text-[#2E7D32] font-bold tracking-widest animate-pulse">
              ONLINE
            </div>
          </div>
        </div>

        {message && (
          <div className="bg-[#2E7D32]/10 border border-[#2E7D32] text-[#2E7D32] px-4 py-3 rounded-lg mb-6 font-mono text-sm shadow-lg">
            SUCCESS: {message}
          </div>
        )}
        {error && (
          <div className="bg-[#D32F2F]/10 border border-[#D32F2F] text-[#D32F2F] px-4 py-3 rounded-lg mb-6 font-mono text-sm shadow-lg">
            CRITICAL_ERROR: {error}
          </div>
        )}

        {/* Primary Data Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column: Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-[#D4D1C8] rounded-xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <svg
                  className="w-12 h-12 text-[#1565C0]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-[#5A6C7D] text-xs font-bold uppercase tracking-widest mb-4">
                Telemetry
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-[#5A6C7D] font-mono uppercase">
                    Geo Coordinates
                  </label>
                  <div className="font-mono text-[#1565C0] text-lg">
                    {pothole.latitude.toFixed(6)},{" "}
                    {pothole.longitude.toFixed(6)}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[#5A6C7D] font-mono uppercase">
                    AI Confidence
                  </label>
                  <div className="font-mono text-[#2E7D32] text-lg">
                    {(pothole.detection.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="h-1 w-full bg-[#E5E1D8] mt-1 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2E7D32]"
                      style={{
                        width: `${pothole.detection.confidence * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[#5A6C7D] font-mono uppercase">
                    Dimensions (BBox)
                  </label>
                  <div className="font-mono text-[#1E3A5F] text-sm">
                    {pothole.detection.bboxWidth.toFixed(1)}{" "}
                    <span className="text-[#5A6C7D]">x</span>{" "}
                    {pothole.detection.bboxHeight.toFixed(1)} px
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#D4D1C8] rounded-xl p-6 shadow-sm">
              <h3 className="text-[#5A6C7D] text-xs font-bold uppercase tracking-widest mb-4">
                Severity Analysis
              </h3>
              {pothole.priorityScore !== null && pothole.priorityLevel ? (
                <div className="space-y-4">
                  <div className="p-4 bg-[#F8F6F1] rounded border border-[#D4D1C8] text-center">
                    <div className="text-4xl font-black text-[#1E3A5F] mb-1">
                      {pothole.priorityScore}
                    </div>
                    <div className="text-[10px] text-[#5A6C7D] font-mono uppercase tracking-widest">
                      Risk Score
                    </div>
                  </div>

                  <div className="text-center">
                    <span
                      className={`inline-block px-4 py-2 rounded text-sm font-black uppercase tracking-widest border ${
                        pothole.priorityLevel === "CRITICAL"
                          ? "bg-[#D32F2F]/10 text-[#D32F2F] border-[#D32F2F]/50 shadow-lg"
                          : pothole.priorityLevel === "HIGH"
                            ? "bg-[#F57C00]/10 text-[#F57C00] border-[#F57C00]/50"
                            : pothole.priorityLevel === "MEDIUM"
                              ? "bg-[#FBC02D]/10 text-[#F57C00] border-[#FBC02D]/50"
                              : "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/50"
                      }`}
                    >
                      {pothole.priorityLevel} SEVERITY
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-[#5A6C7D] text-xs font-mono mb-4 italic">
                    Awaiting Priority Calculation
                  </p>
                  <button
                    onClick={calculateRanking}
                    disabled={actionLoading || !pothole.roadInfo}
                    className="w-full bg-[#7C4DFF] text-white border border-[#7C4DFF] px-4 py-3 rounded font-bold hover:bg-[#7C4DFF]/90 hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none transition uppercase tracking-wider text-sm"
                  >
                    {actionLoading ? "Processing..." : "Run Analysis Protocol"}
                  </button>
                  {!pothole.roadInfo && (
                    <p className="text-[10px] text-[#D32F2F] mt-2 font-mono">
                      ⚠ REQUIRE ROAD DATA FIRST
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Center/Right: Images & Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white border border-[#D4D1C8] rounded-xl p-6 shadow-sm">
              <h3 className="text-[#5A6C7D] text-xs font-bold uppercase tracking-widest mb-4 flex justify-between">
                <span>Visual Evidence</span>
                <span className="font-mono text-[#2E7D32]">CAM_01_FEED</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Raw */}
                <div className="relative group">
                  <div className="absolute top-2 left-2 bg-[#1E3A5F]/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-white border border-white/10 z-10">
                    RAW_INPUT
                  </div>
                  {pothole.imageUrl ? (
                    <img
                      src={pothole.imageUrl}
                      alt="Raw Input"
                      className="w-full h-48 object-cover rounded border border-[#D4D1C8] group-hover:border-[#1565C0] transition"
                    />
                  ) : (
                    <div className="w-full h-48 bg-[#F8F6F1] rounded border border-[#D4D1C8] flex items-center justify-center text-[#5A6C7D] font-mono text-xs">
                      NO_SIGNAL
                    </div>
                  )}
                </div>

                {/* Processed */}
                <div className="relative group">
                  <div className="absolute top-2 left-2 bg-[#2E7D32]/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-white border border-[#2E7D32]/30 z-10">
                    AI_OVERLAY
                  </div>
                  {pothole.imageUrl ? (
                    <div className="relative w-full h-48 border border-[#D4D1C8] group-hover:border-[#2E7D32] transition rounded overflow-hidden bg-white">
                      <img
                        ref={imgRef}
                        src={pothole.imageUrl}
                        alt="Processing"
                        className="hidden"
                        onLoad={drawBoundingBox}
                        crossOrigin="anonymous"
                      />
                      <canvas
                        ref={canvasRef}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-[#F8F6F1] rounded border border-[#D4D1C8] flex items-center justify-center text-[#5A6C7D] font-mono text-xs">
                      NO_SIGNAL
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Map & Context */}
            <div className="bg-white border border-[#D4D1C8] rounded-xl p-6 shadow-sm">
              <h2 className="text-[#5A6C7D] text-xs font-bold uppercase tracking-widest mb-4">
                Location Context
              </h2>

              <div className="mb-6 rounded-lg overflow-hidden border border-[#D4D1C8]">
                <PotholeLocationMap
                  latitude={pothole.latitude}
                  longitude={pothole.longitude}
                  confidence={pothole.detection.confidence}
                />
              </div>

              {pothole.roadInfo ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#D4D1C8]">
                  <div>
                    <label className="text-[10px] text-[#5A6C7D] font-mono uppercase">
                      Sector Name
                    </label>
                    <div className="text-[#1E3A5F] font-bold text-sm uppercase">
                      {pothole.roadInfo.roadName || "UNKNOWN"}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#5A6C7D] font-mono uppercase">
                      Surface Type
                    </label>
                    <div className="text-[#1E3A5F] font-bold text-sm uppercase">
                      {pothole.roadInfo.roadType || "UNKNOWN"}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#5A6C7D] font-mono uppercase">
                      Speed Limit
                    </label>
                    <div className="text-[#1565C0] font-bold font-mono text-sm">
                      {pothole.roadInfo.speedLimit
                        ? `${pothole.roadInfo.speedLimit} KM/H`
                        : "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#5A6C7D] font-mono uppercase">
                      Priority Factor
                    </label>
                    <div className="text-[#F57C00] font-bold font-mono text-sm">
                      {pothole.roadInfo.priorityFactor.toFixed(2)}x
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-[#F8F6F1] p-4 rounded border border-[#D4D1C8]">
                  <span className="text-[#5A6C7D] font-mono text-xs">
                    INFRASTRUCTURE DATA MISSING
                  </span>
                  <button
                    onClick={fetchRoadInfo}
                    disabled={actionLoading}
                    className="bg-[#1565C0] text-white border border-[#1565C0] px-4 py-2 rounded font-bold hover:bg-[#1565C0]/90 text-xs uppercase tracking-wider"
                  >
                    {actionLoading ? "DOWNLOADING..." : "INITIATE DOWNLOAD"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ticket Action Area */}
        <div className="bg-white border border-[#D4D1C8] rounded-xl p-8 mb-8 shadow-sm">
          <h2 className="text-[#1E3A5F] text-xl font-black italic uppercase tracking-tighter mb-4 flex items-center gap-2">
            <span className="bg-gradient-to-r from-[#2E7D32] to-[#1565C0] text-transparent bg-clip-text">
              Action
            </span>{" "}
            Protocol
          </h2>

          {pothole.ticket ? (
            <div className="flex items-center gap-6 p-4 bg-[#F8F6F1] rounded border border-[#D4D1C8]">
              <div>
                <label className="text-[10px] text-[#5A6C7D] font-mono uppercase">
                  Ticket ID
                </label>
                <div className="font-mono text-[#1E3A5F] text-xl tracking-wider">
                  {pothole.ticket.ticketNumber}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[#5A6C7D] font-mono uppercase">
                  Current Status
                </label>
                <div className="text-[#2E7D32] font-bold uppercase">
                  {pothole.ticket.status}
                </div>
              </div>
              <div className="ml-auto">
                <Link
                  href={`/tickets/${pothole.ticket.id}`}
                  className="bg-[#2E7D32] text-white px-6 py-3 rounded font-bold hover:bg-[#2E7D32]/90 transition uppercase tracking-wider text-sm inline-flex items-center gap-2"
                >
                  View Operation Details →
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-[#5A6C7D] text-sm max-w-lg">
                  <p>
                    No active repair ticket exists for this hazard. Confirm
                    details and generate a work order to dispatch field
                    operatives.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowNearbyPotholes(!showNearbyPotholes)}
                    disabled={actionLoading || pothole.priorityScore === null}
                    className="bg-[#1565C0] text-white border border-[#1565C0] px-6 py-4 rounded font-bold hover:bg-[#1565C0]/90 disabled:opacity-50 transition uppercase tracking-widest text-sm shadow-lg"
                  >
                    {showNearbyPotholes ? "HIDE NEARBY" : "FIND NEARBY"}
                  </button>
                  <button
                    onClick={createTicket}
                    disabled={actionLoading || pothole.priorityScore === null}
                    className="bg-[#2E7D32] text-white border border-[#2E7D32] px-8 py-4 rounded font-bold hover:bg-[#2E7D32]/90 disabled:opacity-50 disabled:hover:bg-[#2E7D32] transition uppercase tracking-widest text-sm shadow-lg"
                  >
                    {actionLoading
                      ? "GENERATING..."
                      : selectedNearbyPotholeIds.length > 0
                        ? `CREATE TICKET (${selectedNearbyPotholeIds.length + 1})`
                        : "GENERATE SERVICE TICKET"}
                  </button>
                </div>
              </div>

              {/* Nearby Potholes Selection */}
              {showNearbyPotholes && (
                <div className="mt-6">
                  <NearbyPotholesSelection
                    sourcePotholeId={id}
                    onSelectionChange={setSelectedNearbyPotholeIds}
                    initialSelectedIds={selectedNearbyPotholeIds}
                    radius={500}
                  />
                </div>
              )}
            </div>
          )}
          {pothole.priorityScore === null && !pothole.ticket && (
            <p className="text-[#D32F2F] text-xs font-mono mt-4 text-center">
              ⚠ SEVERITY ANALYSIS REQUIRED BEFORE TICKET GENERATION
            </p>
          )}
        </div>

        {/* Worker Assignment Modal */}
        {showWorkerModal && createdTicketId && (
          <WorkerAssignmentModal
            ticketId={createdTicketId}
            potholeId={id}
            onClose={() => setShowWorkerModal(false)}
            onSuccess={handleWorkerAssignmentSuccess}
          />
        )}
      </div>
    </div>
  );
}
