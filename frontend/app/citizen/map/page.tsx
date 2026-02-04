"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Loader2, Filter } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const ReportsMap = dynamic(() => import("@/components/ReportsMap"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-white border-2 border-[#E5E1D8] rounded-xl flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
      <span className="ml-3 text-[#5A6C7D]">Loading map...</span>
    </div>
  ),
});

interface Media {
  id: string;
  mediaUrl: string;
  mediaType: string;
}

interface Report {
  id: string;
  title?: string;
  description?: string;
  latitude: number;
  longitude: number;
  status: string;
  severity?: number | null;
  createdAt: string;
  media: Array<any>;
  imageUrl?: string | null;
  user?: {
      name?: string;
      email: string;
  };
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

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F] flex flex-col">
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
              City Map View
            </h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="flex-1 p-4 md:p-6 relative flex flex-col max-w-6xl mx-auto w-full">
        {/* Filter Bar */}
        <div className="mb-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 items-center flex-wrap">
            <div className="px-4 py-2 bg-white rounded-lg text-sm text-[#5A6C7D] border-2 border-[#E5E1D8] flex items-center shadow-sm">
              Total Reports: <span className="text-[#1E3A5F] font-bold ml-2">{filteredReports.length}</span>
            </div>
            {['ALL', 'PENDING', 'VERIFIED', 'RESOLVED'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition ${
                  selectedStatus === status
                    ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                    : 'bg-white text-[#5A6C7D] border-[#E5E1D8] hover:border-[#1E3A5F] hover:text-[#1E3A5F]'
                }`}
              >
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div className="hidden md:flex gap-4 text-sm text-[#5A6C7D]">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#C62828]"></span> Critical</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#F9A825]"></span> Moderate</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#2E7D32]"></span> Low</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 w-full rounded-xl overflow-hidden border-2 border-[#E5E1D8] shadow-sm relative min-h-[500px] bg-white">
          {loading ? (
            <div className="h-full flex items-center justify-center bg-white flex-col gap-4">
              <Loader2 className="w-10 h-10 text-[#1E3A5F] animate-spin" />
              <div className="text-[#5A6C7D] text-sm">Loading map data...</div>
            </div>
          ) : (
            // @ts-ignore
            <ReportsMap reports={filteredReports} />
          )}
        </div>
      </div>
    </div>
  );
}
