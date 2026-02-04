"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { UserButton } from "@clerk/nextjs";
import toast from "react-hot-toast";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Users,
  Zap,
  LayoutDashboard,
  Database,
  Navigation,
  Map,
  Download,
  FileText,
} from "lucide-react";
import Link from "next/link";

// Dynamically import map component
const ReportsMap = dynamic(() => import("@/components/ReportsMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-[#F0EDE6] rounded-xl flex items-center justify-center border border-[#E5E1D8]">
      <div className="text-[#1E3A5F] animate-pulse font-medium">
        Loading map...
      </div>
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
      potholes?: {
        id: string;
        priorityLevel: string;
      };
    }>;
  }>;
  user?: {
    name?: string;
    email: string;
  };
}

// Dummy data for charts
const activityData = [
  { name: "00:00", reports: 2, solved: 1 },
  { name: "04:00", reports: 1, solved: 1 },
  { name: "08:00", reports: 5, solved: 2 },
  { name: "12:00", reports: 8, solved: 4 },
  { name: "16:00", reports: 12, solved: 8 },
  { name: "20:00", reports: 6, solved: 5 },
  { name: "23:59", reports: 3, solved: 3 },
];

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(
    undefined,
  );
  const [showExportModal, setShowExportModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [exportStatus, setExportStatus] = useState("ALL");
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [reportMonth, setReportMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      setLoading(true);
      const res = await fetch("/api/reports");
      const data = await res.json();
      if (res.ok) {
        setReports(data.data || data.reports || []);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const params = new URLSearchParams();
      if (exportStatus !== "ALL") params.append("status", exportStatus);
      if (exportStartDate) params.append("startDate", exportStartDate);
      if (exportEndDate) params.append("endDate", exportEndDate);

      const response = await fetch(
        `/api/reports/export-csv?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to export CSV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reports-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("CSV exported successfully!");
      setShowExportModal(false);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export CSV");
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      const params = new URLSearchParams();
      params.append("month", reportMonth);

      const response = await fetch(
        `/api/admin/generate-report-pdf?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const data = await response.json();

      // Create a new window to display the report preview
      const reportWindow = window.open(
        "",
        "report_preview",
        "width=900,height=600",
      );

      if (reportWindow) {
        reportWindow.document.write(`
          <html>
            <head>
              <title>Monthly Report - ${data.month} ${data.year}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
                .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
                h1 { color: #1E3A5F; border-bottom: 3px solid #1E3A5F; padding-bottom: 10px; }
                h2 { color: #2A4A6F; margin-top: 30px; }
                .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
                .stat-box { background: #E8F4FD; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #1E3A5F; }
                .stat-number { font-size: 32px; font-weight: bold; color: #1E3A5F; }
                .stat-label { color: #5A6C7D; font-size: 12px; text-transform: uppercase; margin-top: 5px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #E5E1D8; }
                th { background: #F0EDE6; color: #1E3A5F; font-weight: bold; }
                tr:hover { background: #F8F6F1; }
                .chart-info { background: #F8F6F1; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 3px solid #00E676; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #E5E1D8; text-align: center; color: #5A6C7D; font-size: 12px; }
                @media print {
                  body { background: white; }
                  .container { box-shadow: none; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>📊 Monthly Infrastructure Report</h1>
                <p><strong>Period:</strong> ${data.month} ${data.year} | <strong>Generated:</strong> ${new Date(data.generatedDate).toLocaleString()}</p>
                
                <h2>📈 Summary Statistics</h2>
                <div class="stats">
                  <div class="stat-box">
                    <div class="stat-number">${data.stats.totalReports}</div>
                    <div class="stat-label">Total Reports</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-number">${data.stats.resolvedReports}</div>
                    <div class="stat-label">Resolved</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-number">${data.stats.pendingReports}</div>
                    <div class="stat-label">Pending</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-number">${data.stats.averageResolutionTime.toFixed(1)}</div>
                    <div class="stat-label">Avg Resolution (days)</div>
                  </div>
                </div>

                <h2>📍 Top 20 Pothole Locations</h2>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Location (Lat, Lon)</th>
                      <th>Status</th>
                      <th>Severity</th>
                      <th>Reported Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.topLocations
                      .map(
                        (loc, idx) => `
                      <tr>
                        <td>${idx + 1}</td>
                        <td>${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}</td>
                        <td>
                          <span style="
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 12px;
                            font-weight: bold;
                            ${
                              loc.status === "RESOLVED"
                                ? "background: #E8F5E9; color: #2E7D32;"
                                : loc.status === "VERIFIED"
                                  ? "background: #FFF3E0; color: #E65100;"
                                  : "background: #BBDEFB; color: #1565C0;"
                            }
                          ">
                            ${loc.status}
                          </span>
                        </td>
                        <td>${loc.severity || "-"}</td>
                        <td>${new Date(loc.createdAt).toLocaleDateString()}</td>
                      </tr>
                    `,
                      )
                      .join("")}
                  </tbody>
                </table>

                <h2>📊 Chart Data (JSON)</h2>
                <div class="chart-info">
                  <strong>Daily Reports:</strong> ${data.chartData.dailyReports.length} days tracked
                  <br>
                  <strong>Status Distribution:</strong> ${data.chartData.statusDistribution.map((s) => `${s.status}: ${s.count}`).join(", ")}
                  <br>
                  <strong>Severity Distribution:</strong> ${data.chartData.severityDistribution.map((s) => `${s.severity}: ${s.count}`).join(", ")}
                </div>

                <div class="footer">
                  <p>This report was auto-generated by the Admin Dashboard</p>
                  <p>For detailed analysis and visualizations, please visit the full dashboard</p>
                  <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #1E3A5F; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Report</button>
                </div>
              </div>
            </body>
          </html>
        `);
        reportWindow.document.close();
      }

      toast.success("Report generated successfully!");
      setShowReportModal(false);
    } catch (error) {
      console.error("Report generation error:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const stats = {
    total: reports.length,
    critical: reports.filter(
      (r) => (r.severity || 0) >= 4 || r.priorityLevel === "CRITICAL",
    ).length,
    active: reports.filter((r) => r.status !== "RESOLVED").length,
    aiDetected: reports.filter((r) =>
      r.media.some((m) => m.detections.length > 0),
    ).length,
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F] overflow-hidden font-sans">
      {/* Export CSV Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-2xl font-bold text-[#1E3A5F] mb-4 flex items-center gap-2">
              <Download size={24} />
              Export Reports as CSV
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                  Status Filter
                </label>
                <select
                  value={exportStatus}
                  onChange={(e) => setExportStatus(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#E5E1D8] rounded-lg text-[#1E3A5F] focus:outline-none focus:border-[#1E3A5F]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#E5E1D8] rounded-lg text-[#1E3A5F] focus:outline-none focus:border-[#1E3A5F]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#E5E1D8] rounded-lg text-[#1E3A5F] focus:outline-none focus:border-[#1E3A5F]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-2 border-2 border-[#E5E1D8] text-[#1E3A5F] font-medium rounded-lg hover:bg-[#F0EDE6] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="flex-1 px-4 py-2 bg-[#1E3A5F] text-white font-medium rounded-lg hover:bg-[#2A4A6F] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isExporting ? (
                  <>
                    <span className="animate-spin">⏳</span> Exporting...
                  </>
                ) : (
                  <>
                    <Download size={18} /> Export CSV
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-2xl font-bold text-[#1E3A5F] mb-4 flex items-center gap-2">
              <FileText size={24} />
              Generate Monthly Report
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                  Month & Year
                </label>
                <input
                  type="month"
                  value={reportMonth}
                  onChange={(e) => setReportMonth(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#E5E1D8] rounded-lg text-[#1E3A5F] focus:outline-none focus:border-[#1E3A5F]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2 border-2 border-[#E5E1D8] text-[#1E3A5F] font-medium rounded-lg hover:bg-[#F0EDE6] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="flex-1 px-4 py-2 bg-[#1E3A5F] text-white font-medium rounded-lg hover:bg-[#2A4A6F] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin">⏳</span> Generating...
                  </>
                ) : (
                  <>
                    <FileText size={18} /> Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <nav className="bg-[#1E3A5F] shadow-md sticky top-0 z-50">
        <div className="max-w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <LayoutDashboard className="text-[#1E3A5F]" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">
                  Command Center
                </h1>
                <p className="text-xs text-[#A8C5E2]">
                  Real-time Monitoring Dashboard
                </p>
              </div>
            </Link>

            <div className="h-8 w-px bg-[#A8C5E2]/30 mx-2"></div>

            <div className="flex gap-2">
              {["Dashboard", "Network", "Analytics"].map((item, i) => (
                <button
                  key={item}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${i === 0 ? "bg-white text-[#1E3A5F]" : "text-[#A8C5E2] hover:text-white hover:bg-[#2A4A6F]"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/admin/smart-map"
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#00E676] hover:bg-[#00C853] text-[#050B16] font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <Map size={18} />
              Smart Infra Map
            </Link>
            <Link
              href="/admin/emergency-routing"
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <Navigation size={18} />
              Emergency Routing
            </Link>
            <div className="hidden lg:flex items-center gap-4 text-sm text-[#A8C5E2] bg-[#2A4A6F] px-4 py-2 rounded-lg">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                System Online
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                {reports.length} Reports
              </span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6 p-6 min-h-[calc(100vh-80px)]">
        {/* LEFT COLUMN - Stats & Charts (3 cols) */}
        <div className="hidden lg:flex col-span-3 flex-col gap-6 overflow-y-auto pr-2">
          {/* Data Management Card */}
          <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2A4A6F] rounded-xl p-4 shadow-lg">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Database size={18} />
              Data Management
            </h3>
            <button
              onClick={() => setShowExportModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#1E3A5F] font-medium rounded-lg hover:bg-[#F0EDE6] transition-all mb-2"
            >
              <Download size={18} />
              Export as CSV
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#1E3A5F] font-medium rounded-lg hover:bg-[#F0EDE6] transition-all"
            >
              <FileText size={18} />
              Monthly Report
            </button>
          </div>

          {/* Critical Alert Card */}
          <div className="bg-white border-2 border-[#E5E1D8] p-5 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-[#C62828]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[#C62828] text-sm font-bold mb-1 flex items-center gap-2">
                  <AlertTriangle size={16} /> Critical Issues
                </div>
                <div className="text-4xl font-bold text-[#1E3A5F]">
                  {loading ? "..." : stats.critical}
                </div>
              </div>
              <div className="h-12 w-12 bg-[#FFEBEE] rounded-lg flex items-center justify-center border border-[#FFCDD2]">
                <AlertTriangle className="text-[#C62828]" size={24} />
              </div>
            </div>
            <div className="w-full bg-[#E5E1D8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#C62828] h-full rounded-full transition-all"
                style={{ width: `${Math.min(stats.critical * 10, 100)}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-[#5A6C7D]">
              Requires immediate attention
            </p>
          </div>

          {/* Active Units Card */}
          <div className="bg-white border-2 border-[#E5E1D8] p-5 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-[#1565C0]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[#1565C0] text-sm font-bold mb-1 flex items-center gap-2">
                  <Users size={16} /> Active Reports
                </div>
                <div className="text-4xl font-bold text-[#1E3A5F]">
                  {loading ? "..." : stats.active}
                </div>
              </div>
              <div className="h-12 w-12 bg-[#E3F2FD] rounded-lg flex items-center justify-center border border-[#BBDEFB]">
                <MapPin className="text-[#1565C0]" size={24} />
              </div>
            </div>
            <div className="w-full bg-[#E5E1D8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1565C0] h-full rounded-full transition-all"
                style={{ width: `${Math.min(stats.active * 5, 100)}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-[#5A6C7D]">
              Currently being processed
            </p>
          </div>

          {/* AI Detected Card */}
          <div className="bg-white border-2 border-[#E5E1D8] p-5 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-[#2E7D32]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[#2E7D32] text-sm font-bold mb-1 flex items-center gap-2">
                  <CheckCircle size={16} /> AI Detected
                </div>
                <div className="text-4xl font-bold text-[#1E3A5F]">
                  {loading ? "..." : stats.aiDetected}
                </div>
              </div>
              <div className="h-12 w-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center border border-[#C8E6C9]">
                <Zap className="text-[#2E7D32]" size={24} />
              </div>
            </div>
            <div className="w-full bg-[#E5E1D8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#2E7D32] h-full rounded-full transition-all"
                style={{
                  width: `${stats.total > 0 ? (stats.aiDetected / stats.total) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-[#5A6C7D]">
              Automatically identified
            </p>
          </div>

          {/* Charts Container */}
          <div className="bg-white border-2 border-[#E5E1D8] p-5 rounded-xl shadow-sm">
            <h3 className="text-[#1E3A5F] text-sm font-bold mb-4 flex items-center gap-2">
              <Activity size={16} className="text-[#1565C0]" /> Daily Activity
            </h3>

            <div className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient
                      id="colorReports"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#1E3A5F"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E1D8"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#5A6C7D"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#5A6C7D"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderColor: "#E5E1D8",
                      borderRadius: "8px",
                      color: "#1E3A5F",
                    }}
                    itemStyle={{ color: "#1E3A5F" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="reports"
                    stroke="#1E3A5F"
                    fillOpacity={1}
                    fill="url(#colorReports)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN - Map (6 cols) */}
        <div className="col-span-12 lg:col-span-6 relative flex flex-col h-full rounded-xl overflow-hidden border-2 border-[#E5E1D8] shadow-sm bg-white">
          {/* Map Header Overlay */}
          <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-white/90 to-transparent pointer-events-none flex justify-between">
            <div className="bg-white/95 backdrop-blur border border-[#E5E1D8] px-4 py-2 rounded-lg pointer-events-auto shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-[#1E3A5F]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Map View
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur border border-[#E5E1D8] px-4 py-2 rounded-lg pointer-events-auto flex gap-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-[#5A6C7D]">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>{" "}
                Pending
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5A6C7D]">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>{" "}
                Verified
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5A6C7D]">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>{" "}
                Resolved
              </div>
            </div>
          </div>

          {/* The Map */}
          <div className="flex-1 relative bg-[#F0EDE6]">
            <ReportsMap
              reports={reports}
              onMarkerClick={(r) => setSelectedReportId(r.id)}
              selectedReportId={selectedReportId}
            />
          </div>
        </div>

        {/* RIGHT COLUMN - Recent Feed (3 cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 bg-white border-2 border-[#E5E1D8] rounded-xl p-5 overflow-hidden shadow-sm">
          <div className="flex justify-between items-center mb-2 pb-3 border-b border-[#E5E1D8]">
            <h3 className="text-[#1E3A5F] text-sm font-bold flex items-center gap-2">
              <span className="w-1 h-5 bg-[#1E3A5F] rounded-full"></span>
              Recent Reports
            </h3>
            <span className="text-xs bg-[#E8F4FD] px-3 py-1 rounded-full text-[#1565C0] border border-[#B8D4E8] font-medium">
              {reports.filter((r) => r.status !== "PENDING").length} Total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 -mr-2">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-[#F8F6F1] rounded-lg animate-pulse border border-[#E5E1D8]"
                ></div>
              ))
            ) : reports.filter((r) => r.status !== "PENDING").length === 0 ? (
              <div className="text-center text-[#5A6C7D] py-10">
                No reports yet.
              </div>
            ) : (
              reports
                .filter((report) => report.status !== "PENDING")
                .map((report) => {
                  // Get pothole ID from detection
                  const potholeId = report.media?.[0]?.detections?.[0]?.pothole?.id;
                  
                  // Determine redirect URL based on status and pothole existence
                  const getRedirectUrl = () => {
                    if (potholeId) {
                      // If pothole exists, go to pothole detail page
                      return `/potholes/${potholeId}`;
                    } else if (report.status === "VERIFIED") {
                      // VERIFIED but no pothole yet - go to create page
                      return `/potholes/create?reportId=${report.id}`;
                    }
                    // Default: stay on dashboard
                    return `/admin/dashboard`;
                  };

                  return (
                    <Link
                      key={report.id}
                      href={getRedirectUrl()}
                      onClick={(e) => {
                        // If no pothole, just highlight on map instead of navigating
                        if (!potholeId && report.status !== "VERIFIED") {
                          e.preventDefault();
                          setSelectedReportId(report.id);
                        }
                      }}
                      className={`block p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md group relative overflow-hidden ${
                        selectedReportId === report.id
                          ? "bg-[#E8F4FD] border-[#1E3A5F]"
                          : "bg-white border-[#E5E1D8] hover:border-[#1E3A5F]"
                      }`}
                    >
                  {/* Status Indicator Bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      report.status === "PENDING"
                        ? "bg-blue-500"
                        : report.status === "VERIFIED"
                          ? "bg-amber-500"
                          : "bg-green-500"
                    }`}
                  ></div>

                  <div className="pl-3">
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          report.status === "PENDING"
                            ? "text-blue-700 bg-blue-100"
                            : report.status === "VERIFIED"
                              ? "text-amber-700 bg-amber-100"
                              : "text-green-700 bg-green-100"
                        }`}
                      >
                        {report.status}
                      </span>
                      <span className="text-xs text-[#5A6C7D]">
                        {new Date(report.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#1E3A5F] mb-1 truncate group-hover:text-[#1565C0] transition-colors">
                      {report.title || "Detected Issue"}
                    </h4>

                    <div className="flex items-center gap-1 text-xs text-[#5A6C7D] mb-2">
                      <MapPin size={12} />
                      <span>
                        {report.latitude.toFixed(4)},{" "}
                        {report.longitude.toFixed(4)}
                      </span>
                    </div>

                    {/* Media Detection Badge */}
                    {report.media?.[0]?.detections?.[0] && (
                      <div className="flex items-center gap-2 mt-2 bg-[#F8F6F1] p-2 rounded-lg border border-[#E5E1D8]">
                        <div className="h-6 w-6 bg-[#E8F5E9] rounded flex items-center justify-center">
                          <CheckCircle size={14} className="text-[#2E7D32]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[#5A6C7D]">
                              AI Confidence
                            </span>
                            <span className="text-[#2E7D32] font-bold">
                              {Math.round(
                                report.media[0].detections[0].confidence * 100,
                              )}
                              %
                            </span>
                          </div>
                          <div className="h-1.5 bg-[#E5E1D8] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2E7D32] rounded-full"
                              style={{
                                width: `${report.media[0].detections[0].confidence * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}