'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  totalPotholes: number;
  totalTickets: number;
  totalWorkers: number;
  pendingVerification: number;
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

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [potholesRes, ticketsRes, workersRes, verificationRes] = await Promise.all([
        fetch('/api/potholes'),
        fetch('/api/tickets'),
        fetch('/api/workers'),
        fetch('/api/tickets?status=AWAITING_VERIFICATION'),
      ]);

      const [potholesData, ticketsData, workersData, verificationData] = await Promise.all([
        potholesRes.json(),
        ticketsRes.json(),
        workersRes.json(),
        verificationRes.json(),
      ]);

      setStats({
        totalPotholes: potholesData.total || 0,
        totalTickets: ticketsData.total || 0,
        totalWorkers: workersData.workers?.length || 0,
        pendingVerification: verificationData.tickets?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">Admin Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.firstName}!</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">System-wide management and oversight</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <div className="text-4xl mb-2">🕳️</div>
            <h3 className="text-lg font-bold mb-1">Total Potholes</h3>
            <p className="text-3xl font-bold text-blue-600">{loading ? '...' : stats.totalPotholes}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="text-4xl mb-2">🎫</div>
            <h3 className="text-lg font-bold mb-1">Total Tickets</h3>
            <p className="text-3xl font-bold text-purple-600">{loading ? '...' : stats.totalTickets}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="text-4xl mb-2">👷</div>
            <h3 className="text-lg font-bold mb-1">Active Workers</h3>
            <p className="text-3xl font-bold text-orange-600">{loading ? '...' : stats.totalWorkers}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="text-4xl mb-2">⏳</div>
            <h3 className="text-lg font-bold mb-1">Pending Review</h3>
            <p className="text-3xl font-bold text-yellow-600">{loading ? '...' : stats.pendingVerification}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/potholes" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-lg hover:shadow-xl transition">
            <div className="text-5xl mb-3">🕳️</div>
            <h3 className="text-2xl font-bold mb-2">Potholes</h3>
            <p className="opacity-90">View detected potholes, fetch road context, calculate severity rankings</p>
          </Link>

          <Link href="/tickets" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-lg hover:shadow-xl transition">
            <div className="text-5xl mb-3">🎫</div>
            <h3 className="text-2xl font-bold mb-2">Tickets</h3>
            <p className="opacity-90">Manage repair tickets, assign workers, track status</p>
          </Link>

          <Link href="/workers" className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-lg hover:shadow-xl transition">
            <div className="text-5xl mb-3">👷</div>
            <h3 className="text-2xl font-bold mb-2">Workers</h3>
            <p className="opacity-90">Field worker management, location tracking, task assignment</p>
          </Link>

          <Link href="/admin/review" className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-lg hover:shadow-xl transition">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-2xl font-bold mb-2">Review Queue</h3>
            <p className="opacity-90">Review and approve/reject completed work</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/potholes/create" className="border rounded p-4 hover:bg-gray-50 text-center">
              <div className="text-2xl mb-1">➕</div>
              <div className="font-semibold">Create Pothole</div>
            </Link>
            <Link href="/workers" className="border rounded p-4 hover:bg-gray-50 text-center">
              <div className="text-2xl mb-1">👤</div>
              <div className="font-semibold">Add Worker</div>
            </Link>
            <Link href="/admin/review" className="border rounded p-4 hover:bg-gray-50 text-center">
              <div className="text-2xl mb-1">✓</div>
              <div className="font-semibold">Review Work</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
