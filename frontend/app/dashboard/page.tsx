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
    <div className="min-h-screen bg-[#0A0F1A] text-[#E5E7EB]">
      {/* Header */}
      <div className="bg-[#141B2A] border-b border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#E5E7EB] uppercase tracking-wide">
                Citizen <span className="text-[#22C55E]">Dashboard</span>
              </h1>
              <p className="text-[#9CA3AF] mt-1 font-mono text-sm">
                Report potholes and track your submissions
              </p>
            </div>
            <a
              href="/admin/dashboard"
              className="px-4 py-2 text-sm bg-[#1F2937] text-[#9CA3AF] rounded-md hover:bg-[#374151] hover:text-[#E5E7EB] transition border border-[#374151]"
            >
              Admin View →
            </a>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-[#60A5FA]/10 p-4 rounded-lg border border-[#60A5FA]/30">
              <div className="text-2xl font-bold text-[#60A5FA]">
                {stats.total}
              </div>
              <div className="text-sm text-[#9CA3AF] font-mono uppercase">Total Reports</div>
            </div>
            <div className="bg-[#FBBF24]/10 p-4 rounded-lg border border-[#FBBF24]/30">
              <div className="text-2xl font-bold text-[#FBBF24]">
                {stats.pending}
              </div>
              <div className="text-sm text-[#9CA3AF] font-mono uppercase">Pending</div>
            </div>
            <div className="bg-[#2DD4BF]/10 p-4 rounded-lg border border-[#2DD4BF]/30">
              <div className="text-2xl font-bold text-[#2DD4BF]">
                {stats.verified}
              </div>
              <div className="text-sm text-[#9CA3AF] font-mono uppercase">Verified</div>
            </div>
            <div className="bg-[#22C55E]/10 p-4 rounded-lg border border-[#22C55E]/30">
              <div className="text-2xl font-bold text-[#22C55E]">
                {stats.resolved}
              </div>
              <div className="text-sm text-[#9CA3AF] font-mono uppercase">Resolved</div>
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
            className={`px-6 py-3 rounded-lg font-semibold transition uppercase tracking-wider text-sm ${
              activeTab === "submit"
                ? "bg-[#22C55E] text-black border border-[#22C55E]"
                : "bg-[#141B2A] text-[#9CA3AF] hover:bg-[#1F2937] border border-[#1F2937]"
            }`}
          >
            📝 Submit Report
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-6 py-3 rounded-lg font-semibold transition uppercase tracking-wider text-sm ${
              activeTab === "reports"
                ? "bg-[#22C55E] text-black border border-[#22C55E]"
                : "bg-[#141B2A] text-[#9CA3AF] hover:bg-[#1F2937] border border-[#1F2937]"
            }`}
          >
            📋 My Reports ({stats.total})
          </button>
        </div>

        {/* Content */}
        {activeTab === "submit" ? (
          <ReportSubmissionForm />
        ) : loading ? (
          <div className="bg-[#141B2A] rounded-lg border border-[#1F2937] p-8 text-center">
            <div className="text-[#2DD4BF] font-mono animate-pulse">Loading reports...</div>
          </div>
        ) : (
          <MyReports reports={reports} />
        )}
      </div>
    </div>
  );
}
