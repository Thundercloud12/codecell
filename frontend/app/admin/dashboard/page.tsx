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
    <div className="h-[600px] w-full bg-[#F0EDE6] rounded-xl flex items-center justify-center border border-[#E5E1D8]">
      <div className="text-[#1E3A5F] animate-pulse font-medium">Loading map...</div>
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
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F] overflow-hidden font-sans">
      
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
               {['Dashboard', 'Network', 'Analytics'].map((item, i) => (
                 <button key={item} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${i === 0 ? 'bg-white text-[#1E3A5F]' : 'text-[#A8C5E2] hover:text-white hover:bg-[#2A4A6F]'}`}>
                   {item}
                 </button>
               ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
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
              <div className="bg-[#C62828] h-full rounded-full transition-all" style={{ width: `${Math.min(stats.critical * 10, 100)}%` }}></div>
            </div>
            <p className="mt-2 text-sm text-[#5A6C7D]">Requires immediate attention</p>
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
              <div className="bg-[#1565C0] h-full rounded-full transition-all" style={{ width: `${Math.min(stats.active * 5, 100)}%` }}></div>
            </div>
            <p className="mt-2 text-sm text-[#5A6C7D]">Currently being processed</p>
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
              <div className="bg-[#2E7D32] h-full rounded-full transition-all" style={{ width: `${stats.total > 0 ? (stats.aiDetected / stats.total) * 100 : 0}%` }}></div>
            </div>
            <p className="mt-2 text-sm text-[#5A6C7D]">Automatically identified</p>
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
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" vertical={false} />
                  <XAxis dataKey="name" stroke="#5A6C7D" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#5A6C7D" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E1D8', borderRadius: '8px', color: '#1E3A5F' }}
                    itemStyle={{ color: '#1E3A5F' }}
                  />
                  <Area type="monotone" dataKey="reports" stroke="#1E3A5F" fillOpacity={1} fill="url(#colorReports)" strokeWidth={2} />
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
                   <span className="w-3 h-3 rounded-full bg-blue-500"></span> Pending
                </div>
                <div className="flex items-center gap-2 text-sm text-[#5A6C7D]">
                   <span className="w-3 h-3 rounded-full bg-amber-500"></span> Verified
                </div>
                <div className="flex items-center gap-2 text-sm text-[#5A6C7D]">
                   <span className="w-3 h-3 rounded-full bg-green-500"></span> Resolved
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
              {reports.length} Total
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 -mr-2">
            {loading ? (
               [1,2,3,4,5].map(i => (
                 <div key={i} className="h-24 bg-[#F8F6F1] rounded-lg animate-pulse border border-[#E5E1D8]"></div>
               ))
            ) : reports.length === 0 ? (
               <div className="text-center text-[#5A6C7D] py-10">No reports yet.</div>
            ) : (
              reports.map(report => (
                <div 
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md group relative overflow-hidden ${
                    selectedReportId === report.id
                      ? 'bg-[#E8F4FD] border-[#1E3A5F]' 
                      : 'bg-white border-[#E5E1D8] hover:border-[#1E3A5F]'
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
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        report.status === 'PENDING' ? 'text-blue-700 bg-blue-100' :
                        report.status === 'VERIFIED' ? 'text-amber-700 bg-amber-100' :
                        'text-green-700 bg-green-100'
                      }`}>
                        {report.status}
                      </span>
                      <span className="text-xs text-[#5A6C7D]">
                        {new Date(report.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-bold text-[#1E3A5F] mb-1 truncate group-hover:text-[#1565C0] transition-colors">
                      {report.title || "Detected Issue"}
                    </h4>
                    
                    <div className="flex items-center gap-1 text-xs text-[#5A6C7D] mb-2">
                      <MapPin size={12} />
                      <span>{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                    </div>
                    
                    {/* Media Detection Badge */}
                    {report.media?.[0]?.detections?.[0] && (
                       <div className="flex items-center gap-2 mt-2 bg-[#F8F6F1] p-2 rounded-lg border border-[#E5E1D8]">
                         <div className="h-6 w-6 bg-[#E8F5E9] rounded flex items-center justify-center">
                            <CheckCircle size={14} className="text-[#2E7D32]" />
                         </div>
                         <div className="flex-1">
                           <div className="flex justify-between text-xs mb-1">
                             <span className="text-[#5A6C7D]">AI Confidence</span>
                             <span className="text-[#2E7D32] font-bold">{Math.round(report.media[0].detections[0].confidence * 100)}%</span>
                           </div>
                           <div className="h-1.5 bg-[#E5E1D8] rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-[#2E7D32] rounded-full" 
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
