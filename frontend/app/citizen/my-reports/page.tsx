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
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      case "VERIFIED":
        return "bg-purple-500/10 text-purple-500 border-purple-500/30";
      case "RESOLVED":
        return "bg-[#00E676]/10 text-[#00E676] border-[#00E676]/30";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
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
      <div className="min-h-screen bg-[#050B16] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 animate-spin text-[#00E676]" />
          <span className="text-[#00E676] font-mono tracking-widest animate-pulse">AUTHENTICATING...</span>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050B16] flex items-center justify-center">
        <div className="text-center p-8 border border-[#1F2937] rounded-xl bg-[#0B1220]">
          <h1 className="text-xl font-bold text-red-500 mb-4 uppercase tracking-widest">ACCESS DENIED</h1>
          <p className="text-[#94A3B8] mb-6 font-mono text-sm">Citizen credentials required for access.</p>
          <Link
            href="/sign-in"
            className="bg-[#00E676] text-black px-6 py-3 rounded font-bold hover:bg-[#00E676]/80 transition uppercase tracking-wider"
          >
            Initiate Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B16] text-white">
      <nav className="bg-[#050B16]/90 border-b border-[#1F2937] backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/citizen"
              className="text-[#94A3B8] hover:text-[#00E676] flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold uppercase text-xs tracking-wider">Return to Base</span>
            </Link>
            <h1 className="text-xl font-black italic uppercase tracking-tighter text-white">
              Submission<span className="text-[#00B8D4]">Log</span>
            </h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 uppercase tracking-wide">Report History</h2>
            <p className="text-[#94A3B8] font-mono text-sm">
              ARCHIVE OF SUBMITTED HAZARD DETECTIONS
            </p>
          </div>
          <Link
            href="/citizen/report"
            className="bg-[#00E676] text-black border border-[#00E676] px-6 py-3 rounded font-bold hover:bg-[#00E676]/80 transition uppercase tracking-wider flex items-center gap-2"
          >
            + New Signal
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded p-4 text-red-500 font-mono text-sm">
            ERROR: {error}
          </div>
        )}

        {loading ? (
          <div className="bg-[#0B1220] border border-[#1F2937] rounded-xl p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#00B8D4]" />
            <span className="ml-3 text-[#00B8D4] font-mono animate-pulse">Retrieving archived data...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-[#0B1220] border border-[#1F2937] rounded-xl p-12 text-center">
            <div className="text-6xl mb-4 opacity-20 filter grayscale">📝</div>
            <h3 className="text-xl font-bold mb-2 text-white">No Detections Logged</h3>
            <p className="text-[#94A3B8] mb-6 font-mono text-sm">
              Sector looks clear. Report hazards to update map.
            </p>
            <Link
              href="/citizen/report"
              className="inline-block bg-[#1F2937] text-white border border-[#374151] px-6 py-3 rounded font-bold hover:border-white transition uppercase tracking-wider text-xs"
            >
              Initialize First Report
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-[#0B1220] border border-[#1F2937] rounded-xl hover:border-[#00B8D4]/50 transition duration-300 p-6 group relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#00E676]/5 to-transparent rounded-bl-3xl pointer-events-none"></div>
                <div className="flex flex-col md:flex-row gap-6">
                  {(() => {
                    const imageUrl = getReportImageUrl(report);
                    return imageUrl ? (
                      <div className="flex-shrink-0 relative group/img">
                        <div className="absolute inset-0 bg-[#00E676]/10 mix-blend-overlay opacity-0 group-hover/img:opacity-100 transition pointer-events-none"></div>
                        <img
                          src={imageUrl}
                          alt={report.title}
                          className="w-full md:w-32 h-32 object-cover rounded border border-[#1F2937]"
                        />
                      </div>
                    ) : null;
                  })()}

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-3 gap-2">
                      <div>
                        <h3 className="text-xl font-bold mb-1 text-white group-hover:text-[#00B8D4] transition uppercase tracking-wide">
                          {report.title || "UNLABELED EVENT"}
                        </h3>
                        {report.description && (
                          <p className="text-[#94A3B8] text-sm mb-2 max-w-2xl">
                            {report.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getStatusColor(report.status)}`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-xs font-mono text-[#94A3B8] mt-4 bg-[#050B16] p-3 rounded border border-[#1F2937]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#00E676]" />
                        <span>
                          {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#00E676]" />
                        <span>{formatDate(report.createdAt).toUpperCase()}</span>
                      </div>

                      {report.severity !== null && (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#FFC400]">SEVERITY:</span>
                          <span className="text-white">{report.severity}/10</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-3">
                      <a
                        href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00B8D4] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
                      >
                        Open Global Positioning
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
          <div className="mt-6 text-center text-xs font-mono text-[#94A3B8]">
            ARCHIVE COUNT: <span className="text-white font-bold">{reports.length}</span> RECORDS
          </div>
        )}
      </div>
    </div>
  );
}
