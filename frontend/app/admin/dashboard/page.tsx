"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { UserButton } from "@clerk/nextjs";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area 
} from 'recharts';
import { Activity, AlertTriangle, CheckCircle, MapPin, Users, Zap, LayoutDashboard, Database, Settings } from "lucide-react";
import Link from "next/link";

// Dynamically import map component
const ReportsMap = dynamic(() => import("@/components/ReportsMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-[#0B1220] rounded-2xl flex items-center justify-center border border-[#1F2937]">
      <div className="text-[#00E676] animate-pulse font-mono">INITIALIZING SATELLITE LINK...</div>
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
    }>;
  }>;
  user?: {
    name?: string;
    email: string;
  };
}

// Dummy data for charts
const activityData = [
  { name: '00:00', reports: 2, solved: 1 },
  { name: '04:00', reports: 1, solved: 1 },
  { name: '08:00', reports: 5, solved: 2 },
  { name: '12:00', reports: 8, solved: 4 },
  { name: '16:00', reports: 12, solved: 8 },
  { name: '20:00', reports: 6, solved: 5 },
  { name: '23:59', reports: 3, solved: 3 },
];

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(undefined);

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

  const stats = {
    total: reports.length,
    critical: reports.filter(r => (r.severity || 0) >= 4 || r.priorityLevel === 'CRITICAL').length,
    active: reports.filter(r => r.status !== 'RESOLVED').length,
    aiDetected: reports.filter(r => r.media.some(m => m.detections.length > 0)).length
  };

  return (
    <div className="min-h-screen bg-[#050B16] text-white overflow-hidden font-sans selection:bg-[#00E676] selection:text-black">
      
      {/* Top Navigation */}
      <nav className="border-b border-[#1F2937] bg-[#050B16]/90 backdrop-blur-md sticky top-0 z-50 h-20">
        <div className="h-full w-full px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E676] to-[#00B8D4] flex items-center justify-center shadow-[0_0_15px_rgba(0,230,118,0.4)] group-hover:scale-110 transition-transform">
                <LayoutDashboard className="text-black" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-[#94A3B8]">
                  COMMAND CENTER
                </h1>
                <p className="text-[10px] text-[#00E676] tracking-[0.2em] font-mono group-hover:text-[#00B8D4] transition-colors">
                  SYSTEM OPTIMAL • V2.4.0
                </p>
              </div>
            </Link>

            <div className="h-8 w-px bg-[#1F2937] mx-2"></div>

            <div className="flex gap-2">
               {['DASHBOARD', 'NETWORK', 'ANALYTICS'].map((item, i) => (
                 <button key={item} className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest transition-all ${i === 0 ? 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30' : 'text-[#94A3B8] hover:text-white hover:bg-[#1F2937]'}`}>
                   {item}
                 </button>
               ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center gap-6 text-xs font-mono text-[#94A3B8] bg-[#0B1220] px-4 py-2 rounded-full border border-[#1F2937]">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse"></span>
                  SERVER_LATENCY: 12ms
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B8D4] animate-pulse delay-75"></span>
                  AI_NODES: 4/4 ACTIVE
                </span>
             </div>
             <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6 p-6 h-[calc(100vh-80px)]">
        
        {/* LEFT COLUMN - Stats & Charts (3 cols) */}
        <div className="hidden lg:flex col-span-3 flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Critical Alert Card */}
          <div className="bg-[#0B1220]/80 border border-[#FF1744]/30 p-5 rounded-2xl relative overflow-hidden group hover:border-[#FF1744] transition-all hover:shadow-[0_0_20px_rgba(255,23,68,0.2)]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[#FF1744] text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                  <AlertTriangle size={12} className="animate-pulse" /> Critical Issues
                </div>
                <div className="text-4xl font-black text-white font-mono tracking-tight">
                  {loading ? "..." : stats.critical}
                </div>
              </div>
              <div className="h-10 w-10 bg-[#FF1744]/10 rounded-lg flex items-center justify-center border border-[#FF1744]/20 group-hover:scale-110 transition-transform">
                <AlertTriangle className="text-[#FF1744]" size={20} />
              </div>
            </div>
            <div className="w-full bg-[#1F2937] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#FF1744] h-full rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="mt-2 text-[10px] text-[#94A3B8]">Requires immediate dispatch</p>
          </div>

          {/* Active Units Card */}
          <div className="bg-[#0B1220]/80 border border-[#00B8D4]/30 p-5 rounded-2xl relative overflow-hidden group hover:border-[#00B8D4] transition-all hover:shadow-[0_0_20px_rgba(0,184,212,0.2)]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[#00B8D4] text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Users size={12} /> Active Units
                </div>
                <div className="text-4xl font-black text-white font-mono tracking-tight">
                  {loading ? "..." : "8"}
                </div>
              </div>
              <div className="h-10 w-10 bg-[#00B8D4]/10 rounded-lg flex items-center justify-center border border-[#00B8D4]/20 group-hover:scale-110 transition-transform">
                <MapPin className="text-[#00B8D4]" size={20} />
              </div>
            </div>
            <div className="w-full bg-[#1F2937] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#00B8D4] h-full rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="mt-2 text-[10px] text-[#94A3B8]">Deployment efficiency: 92%</p>
          </div>

          {/* Charts Container */}
          <div className="bg-[#0B1220]/80 border border-[#1F2937] p-5 rounded-2xl flex-1 flex flex-col min-h-[300px]">
            <h3 className="text-[#94A3B8] text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity size={14} className="text-[#00E676]" /> Network Activity
            </h3>
            
            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E676" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#050B16', borderColor: '#00E676', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#00E676' }}
                  />
                  <Area type="monotone" dataKey="reports" stroke="#00E676" fillOpacity={1} fill="url(#colorReports)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN - Map (6 cols) */}
        <div className="col-span-12 lg:col-span-6 relative flex flex-col h-full rounded-3xl overflow-hidden border border-[#1F2937] shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#050B16]">
           {/* Map Header Overlay */}
           <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-[#050B16] to-transparent pointer-events-none flex justify-between">
             <div className="bg-[#050B16]/90 backdrop-blur border border-[#1F2937] px-4 py-2 rounded-lg pointer-events-auto">
               <div className="flex items-center gap-2 text-xs font-mono text-[#00E676]">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]"></span>
                  </span>
                 LIVE_SATELLITE_FEED
               </div>
             </div>
             
             <div className="bg-[#050B16]/90 backdrop-blur border border-[#1F2937] px-4 py-2 rounded-lg pointer-events-auto flex gap-4">
                <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                   <span className="w-2 h-2 rounded-full bg-blue-500"></span> Pending
                </div>
                <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                   <span className="w-2 h-2 rounded-full bg-amber-500"></span> Verified
                </div>
                <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                   <span className="w-2 h-2 rounded-full bg-green-500"></span> Resolved
                </div>
             </div>
           </div>

           {/* The Map */}
           <div className="flex-1 relative bg-[#050B16]">
             <ReportsMap 
               reports={reports} 
               onMarkerClick={(r) => setSelectedReportId(r.id)}
               selectedReportId={selectedReportId}
             />
             
             {/* Cyber UI Overlays (Cornes) */}
             <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-[#00E676]/20 rounded-tl-3xl pointer-events-none z-10"></div>
             <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-[#00E676]/20 rounded-tr-3xl pointer-events-none z-10"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-[#00E676]/20 rounded-bl-3xl pointer-events-none z-10"></div>
             <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-[#00E676]/20 rounded-br-3xl pointer-events-none z-10"></div>
             
             {/* Center Crosshair (Decoration) */}
             <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-10">
                <div className="w-[500px] h-[500px] border border-[#00E676] rounded-full flex items-center justify-center">
                   <div className="w-[300px] h-[300px] border border-[#00B8D4] rounded-full"></div>
                </div>
                <div className="absolute w-full h-px bg-[#00E676]"></div>
                <div className="absolute h-full w-px bg-[#00E676]"></div>
             </div>
           </div>
        </div>

        {/* RIGHT COLUMN - Recent Feed (3 cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 bg-[#0B1220]/50 border border-[#1F2937] rounded-3xl p-5 overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[#94A3B8] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} className="text-[#FFC400]" /> Incoming Data Stream
            </h3>
            <span className="text-[10px] bg-[#1F2937] px-2 py-1 rounded text-[#00E676] border border-[#00E676]/20 font-mono animate-pulse">
              RECEIVING...
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1 -mr-2">
            {loading ? (
               [1,2,3,4,5].map(i => (
                 <div key={i} className="h-24 bg-[#1F2937]/30 rounded-xl animate-pulse border border-[#1F2937]"></div>
               ))
            ) : reports.length === 0 ? (
               <div className="text-center text-[#94A3B8] py-10">No signals detected.</div>
            ) : (
              reports.map(report => (
                <div 
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer hover:translate-x-1 hover:shadow-lg group relative overflow-hidden ${
                    selectedReportId === report.id
                      ? 'bg-[#00E676]/10 border-[#00E676]' 
                      : 'bg-[#050B16] border-[#1F2937] hover:border-[#94A3B8]'
                  }`}
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                          report.status === 'PENDING' ? 'bg-blue-500' :
                                          report.status === 'VERIFIED' ? 'bg-amber-500' :
                                          'bg-green-500'
                                        }`}
                  ></div>

                  <div className="pl-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        report.status === 'PENDING' ? 'text-blue-400 border-blue-900 bg-blue-900/20' :
                        report.status === 'VERIFIED' ? 'text-amber-400 border-amber-900 bg-amber-900/20' :
                        'text-green-400 border-green-900 bg-green-900/20'
                      }`}>
                        {report.status}
                      </span>
                      <span className="text-[10px] text-[#94A3B8] font-mono opacity-70">
                        {new Date(report.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-bold text-white mb-1 truncate group-hover:text-[#00B8D4] transition-colors">
                      {report.title || "Anomaly Detected"}
                    </h4>
                    
                    <div className="flex items-center gap-1 text-[10px] text-[#94A3B8] font-mono mb-2">
                      <MapPin size={10} />
                      <span>{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                    </div>
                    
                    {/* Media Detection Badge */}
                    {report.media?.[0]?.detections?.[0] && (
                       <div className="flex items-center gap-2 mt-2 bg-black/30 p-1.5 rounded-lg border border-[#1F2937]">
                         <div className="h-5 w-5 bg-[#00E676]/20 rounded flex items-center justify-center">
                            <span className="text-[10px]">👁️</span>
                         </div>
                         <div className="flex-1">
                           <div className="flex justify-between text-[10px] mb-0.5">
                             <span className="text-[#94A3B8]">Confidence</span>
                             <span className="text-[#00E676] font-mono">{Math.round(report.media[0].detections[0].confidence * 100)}%</span>
                           </div>
                           <div className="h-1 bg-[#1F2937] rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-[#00E676]" 
                               style={{ width: `${report.media[0].detections[0].confidence * 100}%` }}
                             ></div>
                           </div>
                         </div>
                       </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
