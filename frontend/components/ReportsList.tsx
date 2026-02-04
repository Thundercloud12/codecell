"use client";

import { useState } from "react";

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

interface ReportsListProps {
  reports: Report[];
  onReportClick: (report: Report) => void;
  selectedReportId?: string;
}

type SortField = "createdAt" | "status" | "severity" | "confidence";
type SortOrder = "asc" | "desc";

export default function ReportsList({
  reports,
  onReportClick,
  selectedReportId,
}: ReportsListProps) {
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-blue-100 text-blue-800 border-blue-300",
      VERIFIED: "bg-amber-100 text-amber-800 border-amber-300",
      RESOLVED: "bg-green-100 text-green-800 border-green-300",
    };
    return styles[status] || styles.PENDING;
  };

  const getSeverityColor = (severity?: number) => {
    if (!severity) return "text-gray-400";
    if (severity >= 4) return "text-red-600";
    if (severity >= 3) return "text-orange-500";
    return "text-yellow-500";
  };

  const sortedAndFilteredReports = reports
    .filter((r) => filterStatus === "all" || r.status === filterStatus)
    .sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "severity":
          comparison = (a.severity || 0) - (b.severity || 0);
          break;
        case "confidence":
          const aConfidence = Math.max(
            ...a.media.flatMap((m) => m.detections.map((d) => d.confidence)),
            0,
          );
          const bConfidence = Math.max(
            ...b.media.flatMap((m) => m.detections.map((d) => d.confidence)),
            0,
          );
          comparison = aConfidence - bConfidence;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-400">↕</span>;
    return <span>{sortOrder === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with filters */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Reports ({sortedAndFilteredReports.length})
          </h2>

          <div className="flex items-center gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Thumbnail
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1">
                  Date <SortIcon field="createdAt" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Location
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Status <SortIcon field="status" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("severity")}
              >
                <div className="flex items-center gap-1">
                  Severity <SortIcon field="severity" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("confidence")}
              >
                <div className="flex items-center gap-1">
                  AI Detection <SortIcon field="confidence" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Reporter
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedAndFilteredReports.map((report) => {
              const originalMedia = report.media[0];
              const hasDetection = report.media.some(
                (m) => m.detections.length > 0,
              );
              const highestConfidence = Math.max(
                ...report.media.flatMap((m) =>
                  m.detections.map((d) => d.confidence),
                ),
                0,
              );

              return (
                <tr
                  key={report.id}
                  onClick={() => onReportClick(report)}
                  className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                    selectedReportId === report.id ? "bg-blue-100" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    {originalMedia ? (
                      <div className="relative">
                        <img
                          src={originalMedia.mediaUrl}
                          alt="Report"
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                        {hasDetection && (
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            ✓
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div>{new Date(report.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(report.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="font-medium">
                      {report.title || "Untitled"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {report.latitude.toFixed(4)},{" "}
                      {report.longitude.toFixed(4)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(report.status)}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`font-semibold ${getSeverityColor(report.severity)}`}
                    >
                      {report.severity ? `${report.severity}/5` : "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {hasDetection ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <span className="font-medium">✓ Detected</span>
                        <span className="text-xs text-gray-500">
                          ({(highestConfidence * 100).toFixed(0)}%)
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No Detection
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {report.user?.name || report.user?.email || "Anonymous"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedAndFilteredReports.length === 0 && (
          <div className="p-8 text-center text-gray-400">No reports found</div>
        )}
      </div>
    </div>
  );
}
