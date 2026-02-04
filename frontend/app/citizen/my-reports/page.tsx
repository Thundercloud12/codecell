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

interface Media {
  id: string;
  mediaUrl: string;
  mediaType: string;
  uploadedAt: string;
  detections: Array<{
    id: string;
    detectedClass: string;
    confidence: number;
  }>;
}

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
  media: Media[];
}

export default function MyReportsPage() {
  const { user, isLoaded } = useUser();
  console.log("Current user:", user);
  
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoaded && user) {
      fetchMyReports();
    } else if (isLoaded && !user) {
      setLoading(false);
      setError("Please sign in to view your reports");
    }
  }, [user, isLoaded]);

  async function fetchMyReports() {
    try {
      setLoading(true);
      setError("");
      
      // Get database user first
      const dbUserRes = await fetch("/api/auth/check-user");
      const dbUserData = await dbUserRes.json();
      
      console.log("Database user data:", dbUserData);
      
      if (!dbUserData.success || !dbUserData.exists) {
        setError("User not found in database. Please complete role selection.");
        return;
      }
      
      // Use database user ID to fetch reports
      const res = await fetch(`/api/reports?userId=${dbUserData.user.id}`);
      const data = await res.json();
      
      console.log("Reports response:", data);

      if (data.success) {
        setReports(data.reports || []);
      } else {
        setError(data.error || "Failed to fetch reports");
      }
      
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }

  function getReportImageUrl(report: Report): string | null {
    // Priority: imageUrl first (citizen upload), then media (AI processed)
    if (report.imageUrl) {
      return report.imageUrl;
    }
    if (report.media && report.media.length > 0) {
      return report.media[0].mediaUrl;
    }
    return null;
  }

  function getStatusColor(status: string) {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-amber-100 text-amber-700";
      case "VERIFIED":
        return "bg-blue-100 text-blue-700";
      case "RESOLVED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
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

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 animate-spin text-[#1E3A5F]" />
          <span className="text-[#1E3A5F] font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
        <div className="text-center p-8 border-2 border-[#E5E1D8] rounded-xl bg-white shadow-sm">
          <h1 className="text-xl font-bold text-[#C62828] mb-4">Access Denied</h1>
          <p className="text-[#5A6C7D] mb-6">Please sign in to view your reports.</p>
          <Link
            href="/sign-in"
            className="bg-[#1E3A5F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2A4A6F] transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F]">
      {/* Header */}
      <nav className="bg-[#1E3A5F] shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/citizen"
              className="text-[#A8C5E2] hover:text-white flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-sm">Back to Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-[#A8C5E2]/30"></div>
            <h1 className="text-xl font-bold text-white">
              My Reports
            </h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">Report History</h2>
            <p className="text-[#5A6C7D]">
              View all your submitted road hazard reports
            </p>
          </div>
          <Link
            href="/citizen/report"
            className="bg-[#1E3A5F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2A4A6F] transition flex items-center gap-2"
          >
            + New Report
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white border-2 border-[#E5E1D8] rounded-xl p-12 flex items-center justify-center shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
            <span className="ml-3 text-[#5A6C7D]">Loading your reports...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white border-2 border-[#E5E1D8] rounded-xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4 opacity-30">📝</div>
            <h3 className="text-xl font-bold mb-2 text-[#1E3A5F]">No Reports Yet</h3>
            <p className="text-[#5A6C7D] mb-6">
              You haven't submitted any road hazard reports yet.
            </p>
            <Link
              href="/citizen/report"
              className="inline-block bg-[#1E3A5F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2A4A6F] transition"
            >
              Submit Your First Report
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white border-2 border-[#E5E1D8] rounded-xl hover:border-[#1E3A5F] transition duration-300 p-6 shadow-sm"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {(() => {
                    const imageUrl = getReportImageUrl(report);
                    return imageUrl ? (
                      <div className="flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={report.title}
                          className="w-full md:w-32 h-32 object-cover rounded-lg border border-[#E5E1D8]"
                        />
                      </div>
                    ) : null;
                  })()}

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-3 gap-2">
                      <div>
                        <h3 className="text-lg font-bold mb-1 text-[#1E3A5F]">
                          {report.title || "Untitled Report"}
                        </h3>
                        {report.description && (
                          <p className="text-[#5A6C7D] text-sm mb-2 max-w-2xl">
                            {report.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(report.status)}`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm text-[#5A6C7D] mt-4 bg-[#F8F6F1] p-3 rounded-lg border border-[#E5E1D8]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#1E3A5F]" />
                        <span>
                          {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#1E3A5F]" />
                        <span>{formatDate(report.createdAt)}</span>
                      </div>

                      {report.severity !== null && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#1E3A5F]">Severity:</span>
                          <span className="text-[#C62828] font-bold">{report.severity}/10</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-3">
                      <a
                        href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1565C0] hover:text-[#1E3A5F] text-sm font-medium flex items-center gap-1 hover:underline"
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
          <div className="mt-6 text-center text-sm text-[#5A6C7D]">
            Total Reports: <span className="text-[#1E3A5F] font-bold">{reports.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}
