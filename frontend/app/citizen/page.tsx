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
    <div className="min-h-screen bg-[#050B16] text-white font-sans selection:bg-[#00E676] selection:text-black">
      <nav className="border-b border-[#1F2937] bg-[#050B16]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00E676] rounded flex items-center justify-center font-bold text-black">
              C
            </div>
            <h1 className="text-xl font-bold tracking-widest uppercase text-white">
              Civic<span className="text-[#00E676]">Connect</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-xs text-[#94A3B8] font-mono">OPERATOR_ID</div>
              <div className="font-bold text-[#00E676] uppercase tracking-wider">{user?.firstName}</div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00E676]/20 to-transparent p-1 border border-[#00E676]/30">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          <div className="bg-[#050B16]/80 backdrop-blur p-8 rounded-xl relative z-10 flex flex-col md:flex-row justify-between items-end">
             <div>
                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">
                  Welcome Back,<br/><span className="text-[#00E676]">{user?.firstName}</span>
                </h2>
                <p className="text-[#94A3B8] max-w-lg font-mono text-sm">
                  Your contributions actively improve urban infrastructure safety.
                  Monitor global hazard levels and submit new detections below.
                </p>
             </div>
             <div className="mt-6 md:mt-0 text-right">
                <div className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Total Impact Score</div>
                <div className="text-6xl font-black text-white leading-none tracking-tighter filter drop-shadow-[0_0_10px_rgba(0,230,118,0.5)]">
                  {impactScore.toLocaleString()}
                </div>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Action 1 */}
          <Link
            href="/citizen/report"
            className="group relative h-48 rounded-xl bg-[#0B1220] border border-[#1F2937] overflow-hidden hover:border-[#00E676] transition-all duration-300 flex flex-col justify-end p-6"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <span className="text-9xl font-black">!</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#00E676]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative z-10">
               <div className="w-12 h-12 bg-[#00E676] rounded-full flex items-center justify-center text-black font-bold mb-3 group-hover:scale-110 transition">
                 +
               </div>
               <h3 className="text-xl font-bold uppercase tracking-wider text-white group-hover:text-[#00E676] transition">Log New Hazard</h3>
               <p className="text-xs text-[#94A3B8] font-mono mt-1">Geo-tag and upload evidence</p>
            </div>
          </Link>

          {/* Action 2 */}
          <Link
            href="/citizen/my-reports"
            className="group relative h-48 rounded-xl bg-[#0B1220] border border-[#1F2937] overflow-hidden hover:border-[#00B8D4] transition-all duration-300 flex flex-col justify-end p-6"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <span className="text-9xl font-black">#</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#00B8D4]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative z-10">
               <h3 className="text-xl font-bold uppercase tracking-wider text-white group-hover:text-[#00B8D4] transition">My Submissions</h3>
               <p className="text-xs text-[#94A3B8] font-mono mt-1">Track status and rewards</p>
               <div className="mt-2 text-2xl font-mono text-[#00B8D4] font-bold">{reports.length} <span className="text-xs text-[#94A3B8] align-top">Active</span></div>
            </div>
          </Link>

          {/* Action 3 */}
          <Link
            href="/citizen/map"
            className="group relative h-48 rounded-xl bg-[#0B1220] border border-[#1F2937] overflow-hidden hover:border-[#FFC400] transition-all duration-300 flex flex-col justify-end p-6"
          >
            <div className="absolute inset-0 bg-[url('/map-grid.png')] bg-cover opacity-20 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFC400]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative z-10">
               <h3 className="text-xl font-bold uppercase tracking-wider text-white group-hover:text-[#FFC400] transition">Live Risk Map</h3>
               <p className="text-xs text-[#94A3B8] font-mono mt-1">View city-wide danger zones</p>
            </div>
          </Link>
        </div>

        <div className="bg-[#0B1220] border border-[#1F2937] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#1F2937] flex justify-between items-center">
             <h3 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                Recent Activity Log
             </h3>
             <Link href="/citizen/my-reports" className="text-xs text-[#00E676] hover:underline font-mono uppercase">View All Logs</Link>
          </div>
          
          {loading ? (
            <div className="p-12 text-center text-[#94A3B8] font-mono animate-pulse">
              SYNCING_DATABASE...
            </div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4 opacity-20">📂</div>
              <p className="text-[#94A3B8] text-sm font-mono uppercase">No records found in local database.</p>
              <Link
                href="/citizen/report"
                className="inline-block mt-4 text-[#00E676] border border-[#00E676] px-4 py-2 rounded text-xs font-bold uppercase hover:bg-[#00E676] hover:text-black transition"
              >
                Initiate First Report
              </Link>
            </div>
          ) : (
            <div>
              {reports.slice(0, 5).map((report, idx) => (
                <div
                  key={report.id}
                  className="p-4 border-b border-[#1F2937] hover:bg-[#1F2937]/50 transition flex flex-col sm:flex-row justify-between sm:items-center gap-4 group"
                >
                  <div className="flex items-start gap-4">
                     <div className="font-mono text-[#94A3B8] opacity-50 text-xs mt-1">
                        {(idx + 1).toString().padStart(2, '0')}
                     </div>
                     <div>
                        <div className="font-bold text-white group-hover:text-[#00E676] transition">
                           {report.title || "UNLABELED_HAZARD"}
                        </div>
                        <div className="text-xs text-[#94A3B8] font-mono">
                           COORD: {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                        </div>
                     </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                     report.status === 'VERIFIED' ? 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/30' :
                     report.status === 'PENDING' ? 'bg-[#FFC400]/10 text-[#FFC400] border-[#FFC400]/30' :
                     'bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/30'
                  }`}>
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
