"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ReportsList from "@/components/ReportsList";

// Dynamically import map component to avoid SSR issues with leaflet
const ReportsMap = dynamic(() => import("@/components/ReportsMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

interface Report {
  id: string;
  title?: string;
  description?: string;
  latitude: number;
  longitude: number;
  status: string;
  severity?: number;
  createdAt: string;
  media: Array<{
    id: string;
    mediaUrl: string;
    mediaType: string;
    detections: Array<{
      id: string;
      confidence: number;
      detectedClass: string;
    }>;
  }>;
  user?: {
    name?: string;
    email: string;
  };
}

interface DetailModalProps {
  report: Report;
  onClose: () => void;
}

function DetailModal({ report, onClose }: DetailModalProps) {
  const originalMedia = report.media.find((m) => m.detections.length === 0);
  const detectedMedia = report.media.find((m) => m.detections.length > 0);
  const detection = detectedMedia?.detections[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {report.title || "Pothole Report"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Images Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Image */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Original Image
              </h3>
              {originalMedia ? (
                <img
                  src={originalMedia.mediaUrl}
                  alt="Original"
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  No original image
                </div>
              )}
            </div>

            {/* Detected Image */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                AI Detected Image
              </h3>
              {detectedMedia ? (
                <div>
                  <img
                    src={detectedMedia.mediaUrl}
                    alt="Detected"
                    className="w-full h-64 object-cover rounded-lg border border-green-300"
                  />
                  {detection && (
                    <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                      <div className="text-sm text-green-800">
                        <strong>Confidence:</strong>{" "}
                        {(detection.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-green-800">
                        <strong>Class:</strong> {detection.detectedClass}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  No pothole detected
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Status
                </label>
                <div className="mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      report.status === "PENDING"
                        ? "bg-blue-100 text-blue-800"
                        : report.status === "VERIFIED"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Severity
                </label>
                <div className="mt-1 text-lg font-bold text-red-600">
                  {report.severity || "N/A"} / 5
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Location
                </label>
                <div className="mt-1 text-sm text-gray-700">
                  Lat: {report.latitude.toFixed(6)}
                  <br />
                  Lng: {report.longitude.toFixed(6)}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Reported By
                </label>
                <div className="mt-1 text-sm text-gray-700">
                  {report.user?.name || report.user?.email || "Anonymous"}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Date Reported
                </label>
                <div className="mt-1 text-sm text-gray-700">
                  {new Date(report.createdAt).toLocaleDateString()} at{" "}
                  {new Date(report.createdAt).toLocaleTimeString()}
                </div>
              </div>

              {report.description && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Description
                  </label>
                  <div className="mt-1 text-sm text-gray-700">
                    {report.description}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Update Status
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
              Assign to Team
            </button>
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition">
              Mark as Resolved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<
    string | undefined
  >();
  const [detailReport, setDetailReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reports");

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      setReports(data.data || data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportClick = (report: Report) => {
    setSelectedReportId(report.id);
    setDetailReport(report);
  };

  const getStats = () => {
    const total = reports.length;
    const pending = reports.filter((r) => r.status === "PENDING").length;
    const verified = reports.filter((r) => r.status === "VERIFIED").length;
    const resolved = reports.filter((r) => r.status === "RESOLVED").length;
    const withDetection = reports.filter((r) =>
      r.media.some((m) => m.detections.length > 0),
    ).length;

    return { total, pending, verified, resolved, withDetection };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Smart City Pothole Management System
              </p>
            </div>
            <button
              onClick={fetchReports}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-800">
                {stats.total}
              </div>
              <div className="text-sm text-blue-600">Total Reports</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-800">
                {stats.pending}
              </div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="text-2xl font-bold text-amber-800">
                {stats.verified}
              </div>
              <div className="text-sm text-amber-600">Verified</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-800">
                {stats.resolved}
              </div>
              <div className="text-sm text-green-600">Resolved</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-800">
                {stats.withDetection}
              </div>
              <div className="text-sm text-purple-600">AI Detected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Map Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Spatial Visualization
          </h2>
          <ReportsMap
            reports={reports}
            selectedReportId={selectedReportId}
            onMarkerClick={handleReportClick}
          />
        </div>

        {/* List Section */}
        <div>
          <ReportsList
            reports={reports}
            onReportClick={handleReportClick}
            selectedReportId={selectedReportId}
          />
        </div>
      </div>

      {/* Detail Modal */}
      {detailReport && (
        <DetailModal
          report={detailReport}
          onClose={() => {
            setDetailReport(null);
            setSelectedReportId(undefined);
          }}
        />
      )}
    </div>
  );
}
