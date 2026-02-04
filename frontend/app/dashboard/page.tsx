"use client";

import { useEffect, useState } from "react";
import ReportSubmissionForm from "@/components/dashboard/ReportSubmissionForm";
import MyReports from "@/components/dashboard/MyReports";

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
}

export default function CitizenDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"submit" | "reports">("submit");

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reports");

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      setReports(data.data || data || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "PENDING").length,
    verified: reports.filter((r) => r.status === "VERIFIED").length,
    resolved: reports.filter((r) => r.status === "RESOLVED").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Citizen Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Report potholes and track your submissions
              </p>
            </div>
            <a
              href="/admin/dashboard"
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              Admin View →
            </a>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "submit"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            📝 Submit Report
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "reports"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            📋 My Reports ({stats.total})
          </button>
        </div>

        {/* Content */}
        {activeTab === "submit" ? (
          <ReportSubmissionForm />
        ) : loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-600">Loading reports...</div>
          </div>
        ) : (
          <MyReports reports={reports} />
        )}
      </div>
    </div>
  );
}
