"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { InstallButton } from "../components/InstallButton";
import { OfflineIndicator } from "../components/OfflineIndicator";
import { MobileBottomNav } from "../components/MobileBottomNav";
import { TabletLayout } from "../components/TabletLayout";
import { getOfflineReports, syncOfflineReports } from "../lib/offlineUtils";

interface Report {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  status: string;
  createdAt: string;
  // Add offline support fields
  isOffline?: boolean;
  synced?: boolean;
}

export default function CitizenDashboard() {
  const { user } = useUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Check online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Sync offline reports when coming back online
      syncOfflineReports().then(() => {
        fetchMyReports(); // Refresh reports after sync
      });
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* Mobile Layout (default, hidden on md and up) */}
      <div className="md:hidden min-h-screen bg-gray-50 pb-16">
        {/* Mobile Header - simplified */}
        <nav className="bg-white border-b shadow-sm sticky top-0 z-40">
          <div className="px-4 py-3">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold text-blue-600">Citizen Portal</h1>
              <div className="flex items-center gap-2">
                <OfflineIndicator />
                <InstallButton />
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Content */}
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-1 text-gray-900">
              My Dashboard
            </h2>
            <p className="text-gray-600 text-sm">
              Report potholes and track your submissions
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Link
              href="/citizen/report"
              className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg"
            >
              <div className="text-2xl mb-2">📝</div>
              <h3 className="text-sm font-bold mb-1">Report Pothole</h3>
              <p className="text-xs opacity-90">Submit new report</p>
            </Link>

            <Link
              href="/citizen/my-reports"
              className="bg-white p-4 rounded-lg border hover:shadow-lg transition-all duration-200"
            >
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-sm font-bold mb-1 text-gray-900">My Reports</h3>
              <p className="text-xs text-gray-600">View submissions</p>
            </Link>
          </div>

          {/* Map Link */}
          <Link
            href="/citizen/map"
            className="block bg-white p-4 rounded-lg border hover:shadow-lg transition-all duration-200 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">🗺️</div>
                <h3 className="text-sm font-bold text-gray-900">Map View</h3>
                <p className="text-xs text-gray-600">See all reported potholes</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Recent Reports - Mobile optimized */}
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Recent Reports</h3>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-500 text-sm">Loading...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-gray-500 text-center py-6">
                <div className="text-3xl mb-3">📭</div>
                <p className="mb-3 text-sm">No reports yet</p>
                <Link
                  href="/citizen/report"
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Submit first report →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 3).map((report) => (
                  <div
                    key={report.id}
                    className={`border rounded-lg p-3 transition-all duration-200 ${
                      !report.synced ? 'border-orange-200 bg-orange-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-gray-900 text-sm truncate flex-1 mr-2">
                        {report.title || "Pothole Report"}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'approved' ? 'bg-green-100 text-green-800' :
                        report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </div>
                    {!report.synced && (
                      <div className="text-xs text-orange-600 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0 1 1 0 012 0zm-1 4a1 1 0 00-1 1v4a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Offline - sync pending
                      </div>
                    )}
                  </div>
                ))}
                {reports.length > 3 && (
                  <div className="text-center pt-2">
                    <Link
                      href="/citizen/my-reports"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View all ({reports.length}) →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>

      {/* Tablet Layout */}
      <TabletLayout>
        <div className="max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              My Dashboard
            </h2>
            <p className="text-gray-600">
              Report potholes and track your submissions
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-gray-900">{reports.length}</div>
              <div className="text-sm text-gray-600">Total Reports</div>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
          </div>

          {/* Recent Reports - Tablet optimized */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Recent Reports</h3>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-500">Loading...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-gray-500 text-center py-12">
                <div className="text-5xl mb-4">📭</div>
                <p className="mb-4">You haven't submitted any reports yet.</p>
                <Link
                  href="/citizen/report"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit your first report →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.slice(0, 6).map((report) => (
                  <div
                    key={report.id}
                    className={`border rounded-lg p-4 transition-all duration-200 ${
                      !report.synced ? 'border-orange-200 bg-orange-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          {report.title || "Pothole Report"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-4 ${
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'approved' ? 'bg-green-100 text-green-800' :
                        report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    {!report.synced && (
                      <div className="text-sm text-orange-600 flex items-center mt-2">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0 1 1 0 012 0zm-1 4a1 1 0 00-1 1v4a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Offline - will sync when online
                      </div>
                    )}
                  </div>
                ))}
                {reports.length > 6 && (
                  <div className="text-center pt-4">
                    <Link
                      href="/citizen/my-reports"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View all reports ({reports.length}) →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </TabletLayout>

      {/* Desktop Layout (lg and up) */}
      <div className="hidden lg:block min-h-screen bg-gray-50">
        <nav className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600 truncate">
                Citizen Portal
              </h1>
              <div className="flex items-center gap-2 sm:gap-4">
                <OfflineIndicator />
                <InstallButton />
                <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
                  Welcome, {user?.firstName}!
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">
              My Dashboard
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Report potholes and track your submissions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Link
              href="/citizen/report"
              className="bg-blue-600 text-white p-4 sm:p-6 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="text-3xl sm:text-4xl mb-2">📝</div>
              <h3 className="text-lg sm:text-xl font-bold mb-1">Report Pothole</h3>
              <p className="text-xs sm:text-sm opacity-90">Submit a new pothole report</p>
            </Link>

            <Link
              href="/citizen/my-reports"
              className="bg-white p-4 sm:p-6 rounded-lg border hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <div className="text-3xl sm:text-4xl mb-2">📊</div>
              <h3 className="text-lg sm:text-xl font-bold mb-1 text-gray-900">My Reports</h3>
              <p className="text-xs sm:text-sm text-gray-600">View your submitted reports</p>
            </Link>

            <Link
              href="/citizen/map"
              className="bg-white p-4 sm:p-6 rounded-lg border hover:shadow-lg transition-all duration-200 transform hover:scale-105 sm:col-span-2 lg:col-span-1"
            >
              <div className="text-3xl sm:text-4xl mb-2">🗺️</div>
              <h3 className="text-lg sm:text-xl font-bold mb-1 text-gray-900">Map View</h3>
              <p className="text-xs sm:text-sm text-gray-600">See all reported potholes</p>
            </Link>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Recent Reports</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-500">Loading...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-gray-500 text-center py-8 sm:py-12">
                <div className="text-4xl sm:text-6xl mb-4">📭</div>
                <p className="mb-4 text-sm sm:text-base">You haven't submitted any reports yet.</p>
                <Link
                  href="/citizen/report"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
                >
                  Submit your first report →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 5).map((report) => (
                  <div
                    key={report.id}
                    className={`border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 transition-all duration-200 ${
                      !report.synced ? 'border-orange-200 bg-orange-50' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {report.title || "Pothole Report"}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                      </div>
                      {!report.synced && (
                        <div className="text-xs text-orange-600 mt-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0 1 1 0 012 0zm-1 4a1 1 0 00-1 1v4a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Offline - will sync when online
                        </div>
                      )}
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'approved' ? 'bg-green-100 text-green-800' :
                      report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                ))}
                {reports.length > 5 && (
                  <div className="text-center pt-4">
                    <Link
                      href="/citizen/my-reports"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View all reports →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
