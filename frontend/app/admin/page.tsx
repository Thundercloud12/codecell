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
  const [potholeStats, setPotholeStats] = useState<PotholeCreationStats | null>(null);
  const [creatingPotholes, setCreatingPotholes] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchPotholeCreationStats();
  }, []);

  async function fetchPotholeCreationStats() {
    try {
      const res = await fetch('/api/admin/create-potholes');
      const data = await res.json();
      if (data.success) {
        setPotholeStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch pothole creation stats:', error);
    }
  }

  async function createPotholesFromDetections() {
    if (!confirm('Create potholes from all high-confidence AI detections?')) return;
    
    setCreatingPotholes(true);
    try {
      const res = await fetch('/api/admin/create-potholes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minConfidence: 0.7 }),
      });
      
      const data = await res.json();
      if (data.success) {
        alert(`Success! Created ${data.created} potholes from ${data.total_detections} detections.`);
        // Refresh stats
        fetchStats();
        fetchPotholeCreationStats();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to create potholes');
      console.error('Error creating potholes:', error);
    } finally {
      setCreatingPotholes(false);
    }
  }

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

      console.log('Stats API responses:', {
        potholes: potholesData,
        tickets: ticketsData,
        workers: workersData,
        verification: verificationData,
      });

      setStats({
        totalPotholes: potholesData.total || potholesData.pagination?.total || 0,
        totalTickets: ticketsData.pagination?.total || ticketsData.total || 0,
        totalWorkers: workersData.workers?.length || workersData.total || 0,
        pendingVerification: verificationData.tickets?.length || verificationData.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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

        {/* Pothole Management Section */}
        {potholeStats && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">🕳️ Pothole Management</h3>
            <div className="grid md:grid-cols-4 gap-4 mb-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">{potholeStats.total_high_confidence_detections}</div>
                <div className="text-blue-600">High Confidence Detections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">{potholeStats.existing_potholes}</div>
                <div className="text-green-600">Existing Potholes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-800">{potholeStats.detections_without_potholes}</div>
                <div className="text-orange-600">Unprocessed Detections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-800">{potholeStats.can_create}</div>
                <div className="text-purple-600">Can Create</div>
              </div>
            </div>
            
            {potholeStats.can_create > 0 && (
              <div className="flex items-center gap-4">
                <button
                  onClick={createPotholesFromDetections}
                  disabled={creatingPotholes}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingPotholes ? 'Creating...' : `🚀 Create ${potholeStats.can_create} Potholes from AI Detections`}
                </button>
                <p className="text-sm text-blue-700">
                  Convert high-confidence AI detections (≥70%) into trackable potholes
                </p>
              </div>
            )}
          </div>
        )}

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
