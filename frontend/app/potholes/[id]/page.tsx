"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
      const res = await fetch(`/api/potholes?limit=1&offset=0`);
      const data = await res.json();

      if (data.success) {
        const found = data.potholes.find((p: any) => p.id === id);
        if (found) {
          setPothole(found);
        } else {
          setError("Pothole not found");
        }
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

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ potholeId: id }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage(`Ticket created: ${data.ticket.ticketNumber}`);
        fetchPothole();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to create ticket");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!pothole)
    return <div className="p-8 text-red-600">Pothole not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/potholes" className="text-blue-600 mb-4 inline-block">
        ← Back to Potholes
      </Link>

      <h1 className="text-3xl font-bold mb-6">Pothole Detail</h1>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">ID</label>
            <div className="font-mono text-sm">{pothole.id}</div>
          </div>
          <div>
            <label className="text-sm text-gray-500">Coordinates</label>
            <div>
              {pothole.latitude.toFixed(6)}, {pothole.longitude.toFixed(6)}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-500">
              Detection Confidence
            </label>
            <div>{(pothole.detection.confidence * 100).toFixed(1)}%</div>
          </div>
          <div>
            <label className="text-sm text-gray-500">Bbox Size</label>
            <div>
              {pothole.detection.bboxWidth.toFixed(1)} ×{" "}
              {pothole.detection.bboxHeight.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Detection Images</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original Image */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Original Image
            </h3>
            {pothole.imageUrl ? (
              <img
                src={pothole.imageUrl}
                alt="Original pothole"
                className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
          </div>

          {/* AI Annotated Image */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              AI Detection (Annotated)
            </h3>
            {pothole.imageUrl ? (
              <div className="relative w-full h-64 border-2 border-green-500 rounded-lg overflow-hidden">
                <img
                  ref={imgRef}
                  src={pothole.imageUrl}
                  alt="Original for annotation"
                  className="hidden"
                  onLoad={drawBoundingBox}
                  crossOrigin="anonymous"
                />
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain bg-gray-900"
                />
                <div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  AI Detected
                </div>
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
            {pothole.detection && (
              <div className="mt-2 text-xs text-gray-600">
                <div>
                  BBox: X={pothole.detection.bboxX.toFixed(1)}, Y=
                  {pothole.detection.bboxY.toFixed(1)}
                </div>
                <div>
                  Size: {pothole.detection.bboxWidth.toFixed(1)} ×{" "}
                  {pothole.detection.bboxHeight.toFixed(1)}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-semibold">Note:</span> The annotated image shows
          the AI detection bounding box. Green border indicates AI-processed
          image.
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Road Context</h2>
        {pothole.roadInfo ? (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Road Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Road Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Road Name</label>
                    <div className="font-medium">
                      {pothole.roadInfo.roadName || "Unknown"}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Road Type</label>
                    <div className="font-medium">
                      {pothole.roadInfo.roadType || "Unknown"}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Speed Limit</label>
                    <div className="font-medium">
                      {pothole.roadInfo.speedLimit
                        ? `${pothole.roadInfo.speedLimit} km/h`
                        : "Unknown"}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Traffic Importance
                    </label>
                    <div className="font-medium">
                      {pothole.roadInfo.trafficImportance.toFixed(1)}/5
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Priority Factor
                    </label>
                    <div className="font-medium">
                      {pothole.roadInfo.priorityFactor.toFixed(2)}x
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Map */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Location on Map
                </h3>
                <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${pothole.longitude - 0.002},${pothole.latitude - 0.002},${pothole.longitude + 0.002},${pothole.latitude + 0.002}&layer=mapnik&marker=${pothole.latitude},${pothole.longitude}`}
                    allowFullScreen
                    title="Pothole Location"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Coordinates: {pothole.latitude.toFixed(6)},{" "}
                  {pothole.longitude.toFixed(6)}
                  <br />
                  <a
                    href={`https://www.google.com/maps?q=${pothole.latitude},${pothole.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <p className="text-gray-500 mb-4">
              Road information not fetched yet. Click the button to fetch road
              context from OpenStreetMap.
            </p>
            <button
              onClick={fetchRoadInfo}
              disabled={actionLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {actionLoading ? "Fetching..." : "Fetch Road Info"}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Severity Ranking</h2>
        {pothole.priorityScore !== null && pothole.priorityLevel ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Priority Level</label>
              <div className="text-2xl font-bold">
                <span
                  className={`px-3 py-1 rounded ${
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
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Priority Score</label>
              <div className="text-2xl font-bold">
                {pothole.priorityScore}/100
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 mb-4">Ranking not calculated yet</p>
            <button
              onClick={calculateRanking}
              disabled={actionLoading || !pothole.roadInfo}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              {actionLoading ? "Calculating..." : "Calculate Ranking"}
            </button>
            {!pothole.roadInfo && (
              <p className="text-sm text-gray-500 mt-2">
                Fetch road info first
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Ticket</h2>
        {pothole.ticket ? (
          <div>
            <div className="mb-2">
              <label className="text-sm text-gray-500">Ticket Number</label>
              <div className="font-mono">{pothole.ticket.ticketNumber}</div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-500">Status</label>
              <div className="text-blue-600 font-semibold">
                {pothole.ticket.status}
              </div>
            </div>
            <Link
              href={`/tickets/${pothole.ticket.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
            >
              View Ticket
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 mb-4">No ticket created yet</p>
            <button
              onClick={createTicket}
              disabled={actionLoading || pothole.priorityScore === null}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {actionLoading ? "Creating..." : "Create Ticket"}
            </button>
            {pothole.priorityScore === null && (
              <p className="text-sm text-gray-500 mt-2">
                Calculate ranking first
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
