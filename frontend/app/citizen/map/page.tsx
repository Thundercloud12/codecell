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
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-3 text-gray-600">Loading map...</span>
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
    <div className="min-h-screen bg-[#050B16] text-white flex flex-col">
       {/* Full width Nav */}
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
              Global<span className="text-[#00B8D4]">Risk</span>Map
            </h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="flex-1 p-4 md:p-6 relative flex flex-col">
         {/* Filter Bar */}
         <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2">
                <div className="px-3 py-1 bg-[#1F2937] rounded text-xs font-mono text-[#94A3B8] border border-[#374151] flex items-center">
                SIGNAL_COUNT: <span className="text-white font-bold ml-2">{filteredReports.length}</span>
                </div>
                {['ALL', 'PENDING', 'VERIFIED', 'RESOLVED'].map((status) => (
                <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider border transition ${
                        selectedStatus === status 
                        ? 'bg-[#00E676] text-black border-[#00E676]' 
                        : 'bg-[#050B16] text-[#94A3B8] border-[#1F2937] hover:border-[#00E676]/50'
                    }`}
                >
                    {status}
                </button>
                ))}
            </div>
            <div className="hidden md:flex gap-2 text-xs font-mono text-[#94A3B8]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> CRITICAL</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> MODERATE</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> LOW</span>
            </div>
         </div>

         {/* Map Container */}
         <div className="flex-1 w-full rounded-2xl overflow-hidden border border-[#00B8D4]/30 shadow-[0_0_20px_rgba(0,184,212,0.1)] relative min-h-[500px]">
            {loading ? (
               <div className="h-full flex items-center justify-center bg-[#050B16] flex-col gap-4">
                  <Loader2 className="w-12 h-12 text-[#00E676] animate-spin" />
                  <div className="text-[#00E676] animate-pulse font-mono tracking-widest text-sm">INITIALIZING SATELLITE FEED...</div>
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
