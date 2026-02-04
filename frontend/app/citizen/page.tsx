"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Report {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  status: string;
  createdAt: string;
}

export default function CitizenDashboard() {
  const { user } = useUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyReports();
    }
  }, [user]);

  async function fetchMyReports() {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      // Get database user first
      const dbUserRes = await fetch("/api/auth/check-user");
      const dbUserData = await dbUserRes.json();

      if (dbUserData.success && dbUserData.exists) {
        const res = await fetch(`/api/reports?userId=${dbUserData.user.id}`);
        const data = await res.json();
        if (data.success) {
          setReports(data.reports || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }

  const impactScore = reports.length * 150;

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F] font-sans">
      {/* Header */}
      <nav className="bg-[#1E3A5F] shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1E3A5F] text-xl">🏛️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                Citizen Portal
              </h1>
              <p className="text-[#A8C5E2] text-xs">
                Report Infrastructure Issues
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-white font-medium">
                Welcome, {user?.firstName}!
              </p>
              <p className="text-[#A8C5E2] text-xs">Citizen Reporter</p>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 bg-white border-2 border-[#E5E1D8] rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">
                Welcome back, {user?.firstName}!
              </h2>
              <p className="text-[#5A6C7D] max-w-lg">
                Your contributions help improve road safety in your community.
                Report hazards, track your submissions, and view the city-wide
                risk map.
              </p>
            </div>
            <div className="bg-[#E8F4FD] border border-[#B8D4E8] rounded-xl p-4 text-center min-w-[140px]">
              <div className="text-xs font-medium text-[#5A6C7D] mb-1">
                Impact Score
              </div>
              <div className="text-4xl font-bold text-[#1E3A5F]">
                {impactScore}
              </div>
              <div className="text-xs text-[#5A6C7D]">points earned</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#1E3A5F] mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#1E3A5F] rounded-full"></span>
            Quick Actions
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Report New Issue */}
            <Link
              href="/citizen/report"
              className="bg-white border-2 border-[#E5E1D8] rounded-xl p-6 hover:border-[#1E3A5F] hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#E8F5E9] border-2 border-[#C8E6C9] rounded-lg flex items-center justify-center group-hover:scale-105 transition">
                  <span className="text-2xl">📝</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1E3A5F] mb-1">
                    Report New Issue
                  </h3>
                  <p className="text-[#5A6C7D] text-sm">
                    Submit a pothole or road hazard with photo evidence
                  </p>
                </div>
              </div>
            </Link>

            {/* My Submissions */}
            <Link
              href="/citizen/my-reports"
              className="bg-white border-2 border-[#E5E1D8] rounded-xl p-6 hover:border-[#1E3A5F] hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#E8F4FD] border-2 border-[#B8D4E8] rounded-lg flex items-center justify-center group-hover:scale-105 transition">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1E3A5F] mb-1">
                    My Submissions
                  </h3>
                  <p className="text-[#5A6C7D] text-sm">
                    Track status of your {reports.length} report
                    {reports.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </Link>

            {/* View Map */}
            <Link
              href="/citizen/map"
              className="bg-white border-2 border-[#E5E1D8] rounded-xl p-6 hover:border-[#1E3A5F] hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#FEF3E8] border-2 border-[#E8D4B8] rounded-lg flex items-center justify-center group-hover:scale-105 transition">
                  <span className="text-2xl">🗺️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1E3A5F] mb-1">
                    View Risk Map
                  </h3>
                  <p className="text-[#5A6C7D] text-sm">
                    See all reported issues in your area
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border-2 border-[#E5E1D8] rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-[#E5E1D8] flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#1E3A5F] flex items-center gap-2">
              <span className="w-1 h-6 bg-[#1E3A5F] rounded-full"></span>
              Recent Activity
            </h3>
            <Link
              href="/citizen/my-reports"
              className="text-sm text-[#1E3A5F] hover:underline font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[#5A6C7D]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1E3A5F] mx-auto mb-4"></div>
              Loading your reports...
            </div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4 opacity-30">📂</div>
              <p className="text-[#5A6C7D] mb-4">
                You haven't submitted any reports yet.
              </p>
              <Link
                href="/citizen/report"
                className="inline-block bg-[#1E3A5F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2A4A6F] transition"
              >
                Submit Your First Report
              </Link>
            </div>
          ) : (
            <div>
              {reports.slice(0, 5).map((report, idx) => (
                <div
                  key={report.id}
                  className="p-4 border-b border-[#E5E1D8] last:border-b-0 hover:bg-[#F8F6F1] transition flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#E5E1D8] rounded-full flex items-center justify-center text-sm font-bold text-[#5A6C7D]">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-[#1E3A5F]">
                        {report.title || "Untitled Report"}
                      </div>
                      <div className="text-sm text-[#5A6C7D]">
                        📍 {report.latitude.toFixed(4)},{" "}
                        {report.longitude.toFixed(4)}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      report.status === "VERIFIED"
                        ? "bg-green-100 text-green-700"
                        : report.status === "PENDING"
                          ? "bg-amber-100 text-amber-700"
                          : report.status === "RESOLVED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#E5E1D8] text-center">
          <p className="text-sm text-[#5A6C7D]">
            Road Infrastructure Management System • Citizen Portal
          </p>
        </div>
      </div>
    </div>
  );
}
