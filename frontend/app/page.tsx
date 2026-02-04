"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

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
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold mb-4">Pothole Repair System</h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-Powered Road Maintenance Management
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-in"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">🕳️</div>
            <h3 className="font-bold">AI Detection</h3>
            <p className="text-sm text-gray-600">Automated pothole detection</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">🎫</div>
            <h3 className="font-bold">Smart Ticketing</h3>
            <p className="text-sm text-gray-600">Priority-based repair queue</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">👷</div>
            <h3 className="font-bold">Worker Management</h3>
            <p className="text-sm text-gray-600">
              Real-time tracking & routing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
