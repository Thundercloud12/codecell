"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Stats {
  totalPotholes: number;
  totalTickets: number;
  totalWorkers: number;
  pendingVerification: number;
}

interface PotholeCreationStats {
  total_high_confidence_detections: number;
  existing_potholes: number;
  detections_without_potholes: number;
  can_create: number;
}

export default function AdminDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<Stats>({
    totalPotholes: 0,
    totalTickets: 0,
    totalWorkers: 0,
    pendingVerification: 0,
  });
  const [loading, setLoading] = useState(true);
  const [potholeStats, setPotholeStats] = useState<PotholeCreationStats | null>(
    null,
  );
  const [creatingPotholes, setCreatingPotholes] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchPotholeCreationStats();
  }, []);

  async function fetchPotholeCreationStats() {
    try {
      const res = await fetch("/api/admin/create-potholes");
      const data = await res.json();
      if (data.success) {
        setPotholeStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch pothole creation stats:", error);
    }
  }

  async function createPotholesFromDetections() {
    if (!confirm("Create potholes from all high-confidence AI detections?"))
      return;

    setCreatingPotholes(true);
    try {
      const res = await fetch("/api/admin/create-potholes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minConfidence: 0.7 }),
      });

      const data = await res.json();
      if (data.success) {
        alert(
          `Success! Created ${data.created} potholes from ${data.total_detections} detections.`,
        );
        // Refresh stats
        fetchStats();
        fetchPotholeCreationStats();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to create potholes");
      console.error("Error creating potholes:", error);
    } finally {
      setCreatingPotholes(false);
    }
  }

  async function fetchStats() {
    try {
      const [potholesRes, ticketsRes, workersRes, verificationRes] =
        await Promise.all([
          fetch("/api/potholes"),
          fetch("/api/tickets"),
          fetch("/api/workers"),
          fetch("/api/tickets?status=AWAITING_VERIFICATION"),
        ]);

      const [potholesData, ticketsData, workersData, verificationData] =
        await Promise.all([
          potholesRes.json(),
          ticketsRes.json(),
          workersRes.json(),
          verificationRes.json(),
        ]);

      console.log("Stats API responses:", {
        potholes: potholesData,
        tickets: ticketsData,
        workers: workersData,
        verification: verificationData,
      });

      setStats({
        totalPotholes:
          potholesData.total || potholesData.pagination?.total || 0,
        totalTickets: ticketsData.pagination?.total || ticketsData.total || 0,
        totalWorkers: workersData.workers?.length || workersData.total || 0,
        pendingVerification:
          verificationData.tickets?.length ||
          verificationData.pagination?.total ||
          0,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      {/* Header */}
      <nav className="bg-[#1E3A5F] shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1E3A5F] text-xl font-bold">🏛️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                Administration Portal
              </h1>
              <p className="text-[#A8C5E2] text-xs">
                Road Infrastructure Management System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">
                Welcome, {user?.firstName}!
              </p>
              <p className="text-[#A8C5E2] text-xs">Administrator</p>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8 pb-4 border-b-2 border-[#1E3A5F]/20">
          <h2 className="text-2xl font-bold text-[#1E3A5F]">
            Dashboard Overview
          </h2>
          <p className="text-[#5A6C7D] mt-1">
            System-wide management and oversight
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-[#E5E1D8] p-5 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#E8F4FD] rounded-lg flex items-center justify-center">
                <span className="text-2xl">🕳️</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#5A6C7D] font-medium">
                  Total Structural Reports
                </p>
                <p className="text-2xl font-bold text-[#1E3A5F]">
                  {loading ? "..." : stats.totalPotholes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#E5E1D8] p-5 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#F3E8FD] rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#5A6C7D] font-medium">
                  Total Tickets
                </p>
                <p className="text-2xl font-bold text-[#1E3A5F]">
                  {loading ? "..." : stats.totalTickets}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#E5E1D8] p-5 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#FEF3E8] rounded-lg flex items-center justify-center">
                <span className="text-2xl">👷</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#5A6C7D] font-medium">
                  Active Workers
                </p>
                <p className="text-2xl font-bold text-[#1E3A5F]">
                  {loading ? "..." : stats.totalWorkers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#E5E1D8] p-5 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#FDF8E8] rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#5A6C7D] font-medium">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-[#1E3A5F]">
                  {loading ? "..." : stats.pendingVerification}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Cards */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#1E3A5F] mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#1E3A5F] rounded-full"></span>
            Management Modules
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/potholes"
              className="bg-white border-2 border-[#E5E1D8] rounded-lg p-6 hover:border-[#1E3A5F] hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#E8F4FD] border-2 border-[#B8D4E8] rounded-lg flex items-center justify-center group-hover:scale-105 transition">
                  <span className="text-2xl">🕳️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1E3A5F] mb-1">
                    Structural Management
                  </h3>
                  <p className="text-[#5A6C7D] text-sm leading-relaxed">
                    View detected potholes, fetch road context, calculate
                    severity rankings
                  </p>
                </div>
                <span className="text-[#1E3A5F] text-xl group-hover:translate-x-1 transition">
                  →
                </span>
              </div>
            </Link>

            <Link
              href="/tickets"
              className="bg-white border-2 border-[#E5E1D8] rounded-lg p-6 hover:border-[#1E3A5F] hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#F3E8FD] border-2 border-[#D4B8E8] rounded-lg flex items-center justify-center group-hover:scale-105 transition">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1E3A5F] mb-1">
                    Ticket Management
                  </h3>
                  <p className="text-[#5A6C7D] text-sm leading-relaxed">
                    Manage repair tickets, assign workers, track status updates
                  </p>
                </div>
                <span className="text-[#1E3A5F] text-xl group-hover:translate-x-1 transition">
                  →
                </span>
              </div>
            </Link>

            <Link
              href="/workers"
              className="bg-white border-2 border-[#E5E1D8] rounded-lg p-6 hover:border-[#1E3A5F] hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#FEF3E8] border-2 border-[#E8D4B8] rounded-lg flex items-center justify-center group-hover:scale-105 transition">
                  <span className="text-2xl">👷</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1E3A5F] mb-1">
                    Worker Management
                  </h3>
                  <p className="text-[#5A6C7D] text-sm leading-relaxed">
                    Field worker management, location tracking, task assignment
                  </p>
                </div>
                <span className="text-[#1E3A5F] text-xl group-hover:translate-x-1 transition">
                  →
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Pothole Management Section */}
        {potholeStats && (
          <div className="bg-white border-2 border-[#E5E1D8] rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-[#1E3A5F] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#1E3A5F] rounded-full"></span>
              AI Detection Processing
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#F8F6F1] rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-[#1E3A5F]">
                  {potholeStats.total_high_confidence_detections}
                </p>
                <p className="text-sm text-[#5A6C7D] mt-1">High Confidence</p>
              </div>
              <div className="bg-[#F8F6F1] rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-[#2E7D32]">
                  {potholeStats.existing_potholes}
                </p>
                <p className="text-sm text-[#5A6C7D] mt-1">Existing Records</p>
              </div>
              <div className="bg-[#F8F6F1] rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-[#C77700]">
                  {potholeStats.detections_without_potholes}
                </p>
                <p className="text-sm text-[#5A6C7D] mt-1">Unprocessed</p>
              </div>
              <div className="bg-[#F8F6F1] rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-[#1E3A5F]">
                  {potholeStats.can_create}
                </p>
                <p className="text-sm text-[#5A6C7D] mt-1">Ready to Create</p>
              </div>
            </div>

            {potholeStats.can_create > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-[#E8F4FD] rounded-lg border border-[#B8D4E8]">
                <button
                  onClick={createPotholesFromDetections}
                  disabled={creatingPotholes}
                  className="bg-[#1E3A5F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2A4A6F] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                >
                  {creatingPotholes
                    ? "Processing..."
                    : `Create ${potholeStats.can_create} Records from AI Detections`}
                </button>
                <p className="text-sm text-[#1E3A5F]">
                  Convert high-confidence AI detections (≥70%) into trackable
                  pothole records
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white border-2 border-[#E5E1D8] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#1E3A5F] mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#1E3A5F] rounded-full"></span>
            Quick Actions
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <Link
              href="/potholes/create"
              className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#D1CDC4] rounded-lg hover:border-[#1E3A5F] hover:bg-[#F8F6F1] transition text-center group"
            >
              <div className="w-12 h-12 bg-[#E5E1D8] rounded-full flex items-center justify-center mb-2 group-hover:bg-[#1E3A5F] transition">
                <span className="text-xl group-hover:text-white transition">
                  ➕
                </span>
              </div>
              <span className="font-medium text-[#1E3A5F]">Create Report</span>
              <span className="text-xs text-[#5A6C7D] mt-1">
                Add new record
              </span>
            </Link>
            <Link
              href="/workers"
              className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#D1CDC4] rounded-lg hover:border-[#1E3A5F] hover:bg-[#F8F6F1] transition text-center group"
            >
              <div className="w-12 h-12 bg-[#E5E1D8] rounded-full flex items-center justify-center mb-2 group-hover:bg-[#1E3A5F] transition">
                <span className="text-xl group-hover:text-white transition">
                  👤
                </span>
              </div>
              <span className="font-medium text-[#1E3A5F]">Add Worker</span>
              <span className="text-xs text-[#5A6C7D] mt-1">
                Register staff
              </span>
            </Link>
            <Link
              href="/admin/review"
              className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#D1CDC4] rounded-lg hover:border-[#1E3A5F] hover:bg-[#F8F6F1] transition text-center group"
            >
              <div className="w-12 h-12 bg-[#E5E1D8] rounded-full flex items-center justify-center mb-2 group-hover:bg-[#1E3A5F] transition">
                <span className="text-xl group-hover:text-white transition">
                  ✓
                </span>
              </div>
              <span className="font-medium text-[#1E3A5F]">Review Work</span>
              <span className="text-xs text-[#5A6C7D] mt-1">
                Verify submissions
              </span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#E5E1D8] text-center">
          <p className="text-sm text-[#5A6C7D]">
            Road Infrastructure Management System • Administration Portal
          </p>
        </div>
      </div>
    </div>
  );
}
