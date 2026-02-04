"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const role =
        (user.publicMetadata?.role as string)?.toLowerCase() || "citizen";
      router.push(`/${role}`);
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050B16] text-[#00E676]">
        <div className="animate-pulse font-mono text-xl tracking-widest">INITIALIZING SYSTEM...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B16] text-white overflow-hidden relative selection:bg-[#00E676] selection:text-black font-sans">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(5,11,22,0.8),rgba(5,11,22,0.9)),url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#00E676] opacity-10 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#00B8D4] opacity-10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          <div className="inline-block mb-6 px-4 py-1 rounded-full border border-[#00E676]/30 bg-[#00E676]/10 text-[#00E676] font-mono text-sm tracking-[0.2em] uppercase backdrop-blur-md">
            System Online v2.0
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight leading-none">
            SMART <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E676] to-[#00B8D4] filter drop-shadow-[0_0_10px_rgba(0,230,118,0.3)]">CITIES</span>.
            <br />
            SMARTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B8D4] to-[#00E676] filter drop-shadow-[0_0_10px_rgba(0,184,212,0.3)]">ROADS</span>.
          </h1>
          
          <p className="text-xl md:text-2xl text-[#94A3B8] mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Next-generation autonomous infrastructure management powered by advanced <span className="text-white font-medium">AI detection</span> and <span className="text-white font-medium">real-time geospatial tracking</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/sign-in"
              className="group relative px-8 py-4 bg-[#00E676] text-[#050B16] font-black text-lg rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,230,118,0.5)] border border-[#00E676]"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                ACCESS PORTAL <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
            
            <Link
              href="/sign-up"
              className="group relative px-8 py-4 bg-transparent border-2 border-[#00B8D4] text-[#00B8D4] font-bold text-lg rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,184,212,0.4)] hover:bg-[#00B8D4] hover:text-[#050B16]"
            >
              <span className="relative z-10">REGISTER UNIT</span>
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {[
            { 
              icon: "👁️", 
              title: "AI Detection", 
              desc: "Neural networks classify road anomalies in real-time with 99% accuracy.",
              color: "border-[#00E676]" 
            },
            { 
              icon: "⚡", 
              title: "Instant Dispatch", 
              desc: "Algorithmic worker routing minimizes response time and fuel consumption.",
              color: "border-[#00B8D4]"
            },
            { 
              icon: "📊", 
              title: "Live Analytics", 
              desc: "Command center visualization of city-wide infrastructure health.",
              color: "border-[#FFC400]"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.15), duration: 0.5 }}
              className={`bg-[#0B1220]/60 backdrop-blur-xl p-8 rounded-2xl border ${feature.color} border-opacity-20 hover:border-opacity-100 transition-all hover:-translate-y-2 group hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00E676] transition-colors">
                {feature.title}
              </h3>
              <p className="text-[#94A3B8] leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050B16] to-transparent z-20 pointer-events-none"></div>
    </div>
  );
}
