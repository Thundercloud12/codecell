"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import ChatbotModal from "@/components/ChatbotModal";

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      const role =
        (user.publicMetadata?.role as string)?.toLowerCase() || "citizen";
      router.push(`/${role}`);
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F6F1] text-[#1E3A5F]">
        <div className="animate-pulse font-medium text-xl">Loading...</div>
      </div>
    );
  }

  // If user is logged in, they will be redirected
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F6F1] text-[#1E3A5F]">
        <div className="animate-pulse font-medium text-xl">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F] relative selection:bg-[#1E3A5F] selection:text-white font-sans">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <span className="font-bold text-xl text-[#1E3A5F]">CityRoads</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] hover:bg-[#256029] text-white rounded-lg font-medium transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Chat with Us
            </button>
            <Link
              href="/sign-in"
              className="px-4 py-2 text-[#1E3A5F] hover:text-[#2E7D32] font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#2A4A6F] text-white rounded-lg font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(248,246,241,0.85),rgba(248,246,241,0.92)),url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#1E3A5F] opacity-[0.06] blur-[100px] animate-pulse"></div>
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#2E7D32] opacity-[0.06] blur-[100px] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          <div className="inline-block mb-6 px-4 py-2 rounded-full border-2 border-[#1E3A5F]/20 bg-white/80 text-[#1E3A5F] font-medium text-sm tracking-wide backdrop-blur-md shadow-sm">
            🏛️ City Infrastructure Portal
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-none text-[#1E3A5F]">
            Smart{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#1565C0]">
              Cities
            </span>
            .
            <br />
            Better{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1565C0] to-[#2E7D32]">
              Roads
            </span>
            .
          </h1>

          <p className="text-lg md:text-xl text-[#5A6C7D] mb-12 max-w-3xl mx-auto leading-relaxed">
            Modern infrastructure management powered by{" "}
            <span className="text-[#1E3A5F] font-semibold">AI detection</span>{" "}
            and{" "}
            <span className="text-[#1E3A5F] font-semibold">
              real-time tracking
            </span>{" "}
            — helping keep your city safe and roads maintained.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-in"
              className="group relative px-8 py-4 bg-[#1E3A5F] text-white font-semibold text-lg rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:bg-[#2A4A6F]"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                Sign In{" "}
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </span>
            </Link>

            <Link
              href="/sign-up"
              className="group relative px-8 py-4 bg-white border-2 border-[#1E3A5F] text-[#1E3A5F] font-semibold text-lg rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:bg-[#1E3A5F] hover:text-white"
            >
              <span className="relative z-10">Create Account</span>
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-4">
          {[
            {
              icon: "🔍",
              title: "AI Detection",
              desc: "Advanced neural networks identify road hazards with 99% accuracy.",
              color: "border-[#2E7D32]",
              iconBg: "bg-green-100",
            },
            {
              icon: "⚡",
              title: "Quick Response",
              desc: "Smart routing ensures repair crews reach issues faster.",
              color: "border-[#1565C0]",
              iconBg: "bg-blue-100",
            },
            {
              icon: "📊",
              title: "Live Dashboard",
              desc: "Real-time monitoring of city-wide infrastructure health.",
              color: "border-[#F9A825]",
              iconBg: "bg-amber-100",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              className={`bg-white/80 backdrop-blur-xl p-8 rounded-2xl border-2 ${feature.color} border-opacity-30 hover:border-opacity-100 transition-all hover:-translate-y-2 group shadow-sm hover:shadow-lg`}
            >
              <div
                className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-3 group-hover:text-[#2E7D32] transition-colors">
                {feature.title}
              </h3>
              <p className="text-[#5A6C7D] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8F6F1] to-transparent z-20 pointer-events-none"></div>

      {/* Chatbot Modal */}
      <ChatbotModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}