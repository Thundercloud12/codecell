"use client";

import React, { type FC } from "react";
import { motion, type Variants } from "framer-motion";
import { SignIn } from "@clerk/nextjs";
import { ShieldCheck, Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";

const SignInPage: FC = () => {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F6F1] overflow-hidden flex font-sans text-[#1E3A5F] selection:bg-[#1E3A5F]/20 selection:text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1E3A5F]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[30%] h-[30%] bg-[#2E7D32]/5 rounded-full blur-[100px]" />
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
            className="group flex items-center gap-2 text-sm font-medium text-[#5A6C7D] hover:text-[#1E3A5F] transition-colors mb-8"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border-2 border-[#1E3A5F]/20 backdrop-blur-md shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E7D32]"></span>
              </span>
              <span className="text-xs font-semibold text-[#1E3A5F] tracking-wide uppercase">
                Secure Login
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1E3A5F] mb-2">
              Welcome{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#1565C0]">
                Back
              </span>
            </h1>
            <p className="text-[#5A6C7D] text-lg">
              Enter your credentials to access the system.
            </p>
          </div>

          <div className="bg-white backdrop-blur-xl border-2 border-[#E5E1D8] p-1 rounded-3xl shadow-lg">
            <SignIn
              path="/sign-in"
              routing="path"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/auth/check-role"
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-[#1E3A5F] hover:bg-[#2A4A6F] text-white font-semibold rounded-xl shadow-lg transition-all active:scale-[0.98] py-3.5 text-sm",
                  card: "shadow-none border-0 bg-transparent p-6",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "border-2 border-[#E5E1D8] hover:border-[#1E3A5F] hover:bg-[#1E3A5F]/5 rounded-xl py-2.5 transition-all text-[#1E3A5F] font-medium text-sm",
                  formFieldInput:
                    "px-4 py-3 bg-[#F8F6F1] border border-[#E5E1D8] rounded-xl focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none transition-all placeholder:text-[#94A3B8] text-[#1E3A5F] text-sm",
                  formFieldLabel: "text-[#1E3A5F] font-medium text-sm mb-1.5",
                  footerActionLink:
                    "text-[#1565C0] hover:text-[#2E7D32] font-medium",
                },
              }}
            />
          </div>

          <p className="mt-8 text-center text-xs text-[#5A6C7D]">
            Protected by enterprise-grade encryption. <br />© 2024 CodeCell
          </p>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:block w-[55%] relative overflow-hidden bg-white m-4 rounded-[2.5rem] border-2 border-[#E5E1D8] shadow-xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=2053')] bg-cover bg-center opacity-[0.15] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/5 via-transparent to-[#2E7D32]/5"></div>

        {/* Decorative Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1E3A5F]/5 rounded-full blur-[120px]"></div>

        <div className="relative z-10 h-full flex flex-col justify-between p-16 text-[#1E3A5F]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center border-2 border-[#1E3A5F]/20 shadow-sm">
              <Activity className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Code
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#1565C0]">
                Cell
              </span>
            </span>
          </div>

          <div>
            <blockquote className="text-3xl font-medium leading-normal mb-8 text-[#1E3A5F]">
              "Smart infrastructure management powered by AI detection and
              real-time geospatial tracking."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#2E7D32]/30 overflow-hidden bg-[#2E7D32]/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#2E7D32]" />
              </div>
              <div>
                <div className="font-semibold text-[#1E3A5F]">
                  Secure Platform
                </div>
                <div className="text-sm text-[#5A6C7D]">
                  Enterprise-Grade Security
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;