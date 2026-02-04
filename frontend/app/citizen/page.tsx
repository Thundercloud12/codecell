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
    fetchMyReports();
  }, []);

  async function fetchMyReports() {
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      if (data.success) {
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Citizen Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.firstName}!
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">My Dashboard</h2>
          <p className="text-gray-600">
            Report potholes and track your submissions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/citizen/report"
            className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition"
          >
            <div className="text-4xl mb-2">📝</div>
            <h3 className="text-xl font-bold mb-1">Report Pothole</h3>
            <p className="text-sm opacity-90">Submit a new pothole report</p>
          </Link>

          <Link
            href="/citizen/my-reports"
            className="bg-white p-6 rounded-lg border hover:shadow-lg transition"
          >
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-xl font-bold mb-1">My Reports</h3>
            <p className="text-sm text-gray-600">View your submitted reports</p>
          </Link>

          <Link
            href="/citizen/map"
            className="bg-white p-6 rounded-lg border hover:shadow-lg transition"
          >
            <div className="text-4xl mb-2">🗺️</div>
            <h3 className="text-xl font-bold mb-1">Map View</h3>
            <p className="text-sm text-gray-600">See all reported potholes</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-xl font-bold mb-4">Recent Reports</h3>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : reports.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              <p className="mb-4">You haven't submitted any reports yet.</p>
              <Link
                href="/citizen/report"
                className="text-blue-600 hover:underline"
              >
                Submit your first report →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="border rounded p-3 flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold">
                      {report.title || "Pothole Report"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {report.latitude.toFixed(6)},{" "}
                      {report.longitude.toFixed(6)}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
