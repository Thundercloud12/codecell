"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Upload, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues
const LocationPickerMap = dynamic(
  () => import("@/components/LocationPickerMap"),
  { ssr: false },
);

export default function ReportPotholePage() {
  const { user } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function getCurrentLocation() {
    setGettingLocation(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setGettingLocation(false);
      },
      (error) => {
        setError(`Location error: ${error.message}`);
        setGettingLocation(false);
      },
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 1: Create report first (with or without image)
      const reportPayload = {
        title: title || "Pothole Report",
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };

      const reportResponse = await fetch("/api/reports/simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportPayload),
      });

      const reportData = await reportResponse.json();

      if (!reportData.success) {
        console.error("Report creation failed:", reportData);
        setError(
          reportData.error || reportData.details || "Failed to submit report",
        );
        setLoading(false);
        return;
      }
      console.log(reportData);

      const reportId = reportData.report.id;

      // Step 2: Upload image if provided
      if (imageFile && reportId) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("type", "image");
        formData.append("reportId", reportId);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadData.success) {
          console.warn(
            "Image upload failed, but report was created:",
            uploadData,
          );
          // Don't fail the whole operation if image upload fails
        }
      }

      // Success!
      setSuccess(true);
      setTimeout(() => {
        router.push("/citizen/my-reports");
      }, 2000);
    } catch (err: any) {
      console.error("Error submitting report:", err);
      setError(
        err.message ||
          "Failed to submit report. Please check the console for details.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center p-4">
        <div className="bg-white border-2 border-[#2E7D32] rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-[#E8F5E9] border-2 border-[#C8E6C9] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-[#2E7D32]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">
            Report Submitted Successfully!
          </h2>
          <p className="text-[#5A6C7D] mb-8 leading-relaxed">
            Thank you for your contribution. Your report has been received and
            will be reviewed by our team shortly.
          </p>
          <div className="text-sm text-[#1E3A5F] font-medium">
            Redirecting to your reports...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E3A5F]">
      {/* Header */}
      <nav className="bg-[#1E3A5F] shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/citizen"
              className="text-[#A8C5E2] hover:text-white flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-sm">Back to Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-[#A8C5E2]/30"></div>
            <h1 className="text-xl font-bold text-white">New Report</h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6 md:p-8">
        <div className="bg-white border-2 border-[#E5E1D8] rounded-xl p-8 shadow-sm">
          <div className="border-b border-[#E5E1D8] pb-6 mb-6">
            <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">
              Report a Road Issue
            </h2>
            <p className="text-[#5A6C7D]">
              Please provide the location and details of the road hazard you've
              identified.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                Title{" "}
                <span className="text-[#5A6C7D] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pothole on Main Street"
                className="w-full px-4 py-3 bg-[#F8F6F1] border border-[#E5E1D8] text-[#1E3A5F] rounded-lg focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none text-sm placeholder:text-[#94A3B8] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                Description{" "}
                <span className="text-[#5A6C7D] font-normal">(Optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional details about the issue..."
                rows={4}
                className="w-full px-4 py-3 bg-[#F8F6F1] border border-[#E5E1D8] text-[#1E3A5F] rounded-lg focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none text-sm placeholder:text-[#94A3B8] transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E3A5F] mb-3">
                Location <span className="text-red-500">*</span>
              </label>

              {/* Toggle Map Button */}
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-[#E8F4FD] text-[#1565C0] border border-[#B8D4E8] rounded-lg hover:bg-[#D4E8F8] transition text-sm font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                {showMap ? "Hide Map" : "📍 Pick Location on Map"}
              </button>

              {/* Interactive Map */}
              {showMap && (
                <div className="mb-4 animate-fadeIn">
                  <LocationPickerMap
                    latitude={latitude}
                    longitude={longitude}
                    onLocationSelect={(lat, lng) => {
                      setLatitude(lat.toFixed(6));
                      setLongitude(lng.toFixed(6));
                    }}
                    height="450px"
                  />
                </div>
              )}

              {/* OR Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E1D8]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#94A3B8]">
                    Or Enter Manually
                  </span>
                </div>
              </div>

              {/* Coordinate Inputs */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    required
                    placeholder="Latitude (e.g. 28.6139)"
                    className="w-full px-4 py-3 bg-[#F8F6F1] border border-[#E5E1D8] text-[#1E3A5F] rounded-lg focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none text-sm"
                  />
                </div>

                <div>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    required
                    placeholder="Longitude (e.g. 77.2090)"
                    className="w-full px-4 py-3 bg-[#F8F6F1] border border-[#E5E1D8] text-[#1E3A5F] rounded-lg focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Use Current Location Button */}
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="flex items-center gap-2 px-4 py-2 bg-[#2DD4BF]/10 text-[#0D9488] border border-[#2DD4BF]/30 rounded-lg hover:bg-[#2DD4BF]/20 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {gettingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Getting your location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    Use My Current GPS Location
                  </>
                )}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E3A5F] mb-2">
                Photo Evidence{" "}
                <span className="text-[#5A6C7D] font-normal">(Optional)</span>
              </label>
              <div className="border-2 border-dashed border-[#E5E1D8] bg-[#F8F6F1] rounded-xl p-8 text-center hover:border-[#1E3A5F] transition cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center w-full h-full"
                >
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 rounded-lg border border-[#E5E1D8] mx-auto"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setImageFile(null);
                          setImagePreview("");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-[#94A3B8] mb-4 group-hover:text-[#1E3A5F] group-hover:scale-105 transition duration-300" />
                      <span className="text-[#1E3A5F] font-medium group-hover:text-[#1E3A5F] transition">
                        Click to upload a photo
                      </span>
                      <span className="text-xs text-[#5A6C7D] mt-2">
                        PNG, JPG up to 10MB
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-[#E5E1D8]">
              <button
                type="submit"
                disabled={loading || !latitude || !longitude}
                className="flex-1 bg-[#1E3A5F] text-white px-6 py-4 rounded-lg font-medium hover:bg-[#2A4A6F] disabled:bg-[#E5E1D8] disabled:text-[#94A3B8] disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </button>

              <Link
                href="/citizen"
                className="px-6 py-4 border-2 border-[#E5E1D8] text-[#5A6C7D] rounded-lg font-medium hover:border-[#1E3A5F] hover:text-[#1E3A5F] transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
