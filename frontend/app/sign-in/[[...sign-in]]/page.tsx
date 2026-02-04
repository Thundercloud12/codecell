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
    <div className="min-h-screen w-full bg-white overflow-hidden flex font-sans text-slate-900 selection:bg-blue-100">
      {/* Background Gradients (Matches Landing Page) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[30%] h-[30%] bg-purple-100/40 rounded-full blur-[100px]" />
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
            className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8"
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
                AarogyaKavach Secure Login
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-lg">
              Enter your details to access the clinical dashboard.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/50 p-1 rounded-3xl shadow-2xl shadow-slate-200/50">
            <SignIn
              path="/sign-in"
              routing="path"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/auth/check-role"
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] py-3.5 text-sm",
                  card: "shadow-none border-0 bg-transparent p-6",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl py-2.5 transition-all text-slate-600 font-medium text-sm",
                  formFieldInput:
                    "px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-900 text-sm",
                  formFieldLabel: "text-slate-700 font-medium text-sm mb-1.5",
                  footerActionLink:
                    "text-blue-600 hover:text-blue-700 font-medium",
                },
              }}
            />
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            Protected by enterprise-grade encryption. <br />© 2024 AarogyaKavach
            Inc.
          </p>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:block w-[55%] relative overflow-hidden bg-slate-900 m-4 rounded-[2.5rem]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2053')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900/90"></div>

        {/* Decorative Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]"></div>

        <div className="relative z-10 h-full flex flex-col justify-between p-16 text-white">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              AarogyaKavach
            </span>
          </div>

          <div>
            <blockquote className="text-3xl font-medium leading-normal mb-8 text-slate-100">
              "The most efficient way to manage patient workflows and hospital
              resources at scale."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-white/10 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=2070"
                  className="w-full h-full object-cover"
                  alt="Doctor"
                />
              </div>
              <div>
                <div className="font-semibold">Dr. Sarah Chen</div>
                <div className="text-sm text-slate-400">
                  Chief of Medicine, Apollo Main
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
