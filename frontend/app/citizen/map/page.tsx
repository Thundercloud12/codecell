"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Loader2, Filter } from "lucide-react";

interface Report {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  status: string;
  severity: number | null;
  imageUrl: string | null;
  createdAt: string;
}

export default function MapViewPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  useEffect(() => {
    fetchAllReports();
  }, []);

  async function fetchAllReports() {
    try {
      // Fetch all reports (not just user's reports)
      const res = await fetch("/api/reports/all");
      const data = await res.json();

      if (data.success) {
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredReports =
    selectedStatus === "ALL"
      ? reports
      : reports.filter((r) => r.status === selectedStatus);

  function getStatusColor(status: string) {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-500";
      case "VERIFIED":
        return "bg-blue-500";
      case "RESOLVED":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
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
            <h1 className="text-2xl font-bold text-blue-600">Map View</h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">All Reported Potholes</h2>
          <p className="text-gray-600">View all pothole reports in your area</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold">Filter by Status:</span>
            <div className="flex gap-2">
              {["ALL", "PENDING", "VERIFIED", "RESOLVED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredReports.length} of {reports.length} reports
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading map data...</span>
          </div>
        ) : (
          <>
            {/* Map Placeholder - You can integrate Google Maps or Mapbox here */}
            <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-96 flex items-center justify-center border-b-4 border-blue-600">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Interactive Map Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    This will display all pothole locations on an interactive
                    map
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Integrate with Google Maps API or Mapbox
                  </p>
                </div>
              </div>
            </div>

            {/* List View */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Reported Locations</h3>

              {filteredReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No reports found for selected filter
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-4">
                        {report.imageUrl && (
                          <img
                            src={report.imageUrl}
                            alt={report.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-semibold mb-1">
                            {report.title || "Pothole Report"}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {report.latitude.toFixed(6)},{" "}
                            {report.longitude.toFixed(6)}
                          </div>
                          {report.severity !== null && (
                            <div className="text-xs text-gray-500 mt-1">
                              Severity: {report.severity}/10
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {report.status}
                          </span>
                        </div>

                        <a
                          href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
          <p className="text-sm text-blue-800">
            To integrate a real interactive map, add Google Maps API or Mapbox
            to this page. The data is already available via the API endpoint{" "}
            <code className="bg-white px-2 py-1 rounded">/api/reports/all</code>
          </p>
        </div>
      </div>
    </div>
  );
}
