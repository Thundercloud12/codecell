"use client";

import React, { type FC } from "react";
import { motion, type Variants } from "framer-motion";
import { SignUp } from "@clerk/nextjs";
import { Construction, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

const SignUpPage: FC = () => {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0F1A] overflow-hidden flex font-sans text-[#E5E7EB] selection:bg-[#22C55E]/20">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2DD4BF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[30%] h-[30%] bg-[#22C55E]/10 rounded-full blur-[100px]" />
      </div>

      {/* Left Side - Form */}
      <div className="relative z-10 w-full lg:w-[45%] flex flex-col justify-center px-8 lg:px-24">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-8 lg:left-12 flex items-center gap-2"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-medium text-[#9CA3AF] hover:text-[#22C55E] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141B2A] border border-[#2DD4BF]/30 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2DD4BF]"></span>
              </span>
              <span className="text-xs font-semibold text-[#2DD4BF] tracking-wide uppercase">
                Join the Network
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#E5E7EB] mb-2 uppercase">
              Create <span className="text-[#2DD4BF]">Account</span>
            </h1>
            <p className="text-[#9CA3AF] text-lg">
              Sign up to start reporting potholes and improving road safety.
            </p>
          </div>

          <div className="bg-[#141B2A]/70 backdrop-blur-xl border border-[#1F2937] p-1 rounded-3xl shadow-2xl shadow-black/50">
            <SignUp
              path="/sign-up"
              routing="path"
              signInUrl="/sign-in"
              fallbackRedirectUrl="/auth/check-role"
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-[#2DD4BF] hover:bg-[#2DD4BF]/80 text-black font-semibold rounded-xl shadow-lg shadow-[#2DD4BF]/20 transition-all active:scale-[0.98] py-3.5 text-sm",
                  card: "shadow-none border-0 bg-transparent p-6",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "border border-[#1F2937] hover:border-[#2DD4BF]/50 hover:bg-[#2DD4BF]/10 rounded-xl py-2.5 transition-all text-[#9CA3AF] font-medium text-sm",
                  formFieldInput:
                    "px-4 py-3 bg-[#0A0F1A] border border-[#1F2937] rounded-xl focus:border-[#2DD4BF] focus:ring-4 focus:ring-[#2DD4BF]/10 outline-none transition-all placeholder:text-[#9CA3AF] text-[#E5E7EB] text-sm",
                  formFieldLabel: "text-[#9CA3AF] font-medium text-sm mb-1.5",
                  footerActionLink:
                    "text-[#2DD4BF] hover:text-[#22C55E] font-medium",
                },
              }}
            />
          </div>

          <p className="mt-8 text-center text-xs text-[#9CA3AF]">
            By signing up, you agree to our Terms & Privacy Policy. <br />© 2026 CodeCell
          </p>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:block w-[55%] relative overflow-hidden bg-[#141B2A] m-4 rounded-[2.5rem] border border-[#1F2937]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#2DD4BF]/10 to-[#0A0F1A]/90"></div>

        {/* Decorative Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2DD4BF]/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 h-full flex flex-col justify-between p-16 text-white">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#2DD4BF]/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-[#2DD4BF]/30">
              <Construction className="w-5 h-5 text-[#2DD4BF]" />
            </div>
            <span className="font-bold text-xl tracking-tight uppercase">
              Code<span className="text-[#2DD4BF]">Cell</span>
            </span>
          </div>

          <div>
            <blockquote className="text-3xl font-medium leading-normal mb-8 text-[#E5E7EB]">
              "AI-powered detection and smart ticketing have transformed how we maintain our city's roads."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#2DD4BF]/30 overflow-hidden bg-[#2DD4BF]/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#2DD4BF]" />
              </div>
              <div>
                <div className="font-semibold text-[#E5E7EB]">City Works Department</div>
                <div className="text-sm text-[#9CA3AF]">
                  Join thousands of citizens making roads safer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

