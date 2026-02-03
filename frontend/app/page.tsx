import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex flex-col items-center justify-center text-center px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            🚗 Smart City
          </h1>
          <h2 className="text-4xl font-bold text-blue-600 mb-6">
            Pothole Management System
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl">
            AI-powered pothole detection and reporting system for safer roads.
            Report potholes, track repairs, and help improve your city's
            infrastructure.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-3">📸</div>
            <h3 className="text-lg font-semibold mb-2">AI Detection</h3>
            <p className="text-gray-600 text-sm">
              Upload photos and let our AI detect and verify potholes
              automatically
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-3">🗺️</div>
            <h3 className="text-lg font-semibold mb-2">Real-time Map</h3>
            <p className="text-gray-600 text-sm">
              View all reported potholes on an interactive map with status
              updates
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600 text-sm">
              Monitor your reports from submission to resolution in real-time
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            📝 Report a Pothole
          </Link>
          <Link
            href="/admin/dashboard"
            className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-300 rounded-lg font-semibold text-lg hover:bg-gray-50 transition shadow-lg hover:shadow-xl"
          >
            🔧 Admin Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 text-gray-600 text-sm">
          <p>Powered by AI • Real-time Detection • Community Driven</p>
        </div>
      </main>
    </div>
  );
}
