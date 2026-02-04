"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  severity: number | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function MyReportsPage() {
  const { user } = useUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyReports();
  }, []);

  async function fetchMyReports() {
    try {
      // Get database user first
      const dbUserRes = await fetch("/api/auth/check-user");
      const dbUserData = await dbUserRes.json();

      if (dbUserData.success && dbUserData.exists) {
        const res = await fetch(`/api/reports?userId=${dbUserData.user.id}`);
        const data = await res.json();

        if (data.success) {
          setReports(data.reports || []);
        } else {
          setError(data.error || "Failed to fetch reports");
        }
      } else {
        setError("User not found in database. Please complete role selection.");
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "VERIFIED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "RESOLVED":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/citizen"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">My Reports</h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Submitted Reports</h2>
            <p className="text-gray-600">
              Track the status of all your pothole reports
            </p>
          </div>
          <Link
            href="/citizen/report"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + New Report
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading your reports...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-2">No Reports Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't submitted any pothole reports yet.
            </p>
            <Link
              href="/citizen/report"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Submit Your First Report
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
              >
                <div className="flex gap-6">
                  {report.imageUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={report.imageUrl}
                        alt={report.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">
                          {report.title || "Pothole Report"}
                        </h3>
                        {report.description && (
                          <p className="text-gray-600 mb-2">
                            {report.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(report.status)}`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {report.latitude.toFixed(6)},{" "}
                          {report.longitude.toFixed(6)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(report.createdAt)}</span>
                      </div>

                      {report.severity !== null && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Severity:</span>
                          <span>{report.severity}/10</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-3">
                      <a
                        href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        View on Map
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {reports.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {reports.length} report{reports.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
