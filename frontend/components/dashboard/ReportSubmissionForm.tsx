"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues
const LocationPickerMap = dynamic(
  () => import("@/components/LocationPickerMap"),
  { ssr: false },
);

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function ReportSubmissionForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        });
        setGettingLocation(false);
      },
      (error) => {
        setError(`Location error: ${error.message}`);
        setGettingLocation(false);
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!file) {
      setError("Please select an image");
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setError("Please provide location coordinates");
      return;
    }

    setLoading(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append("file", file);
      submitFormData.append("title", formData.title || "Pothole Report");
      submitFormData.append("description", formData.description);
      submitFormData.append("latitude", formData.latitude);
      submitFormData.append("longitude", formData.longitude);

      const response = await fetch("/api/reports", {
        method: "POST",
        body: submitFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit report");
      }

      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        latitude: "",
        longitude: "",
      });
      setFile(null);
      setPreview("");

      // Redirect to reports list after 2 seconds
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#141B2A] rounded-lg border border-[#1F2937] p-6">
      <h2 className="text-2xl font-bold text-[#E5E7EB] mb-6 uppercase tracking-wide">
        Report a <span className="text-[#22C55E]">Pothole</span>
      </h2>

      {success && (
        <div className="mb-4 p-4 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg">
          <div className="flex items-center gap-2 text-[#22C55E]">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold">Report Submitted Successfully!</p>
              <p className="text-sm text-[#9CA3AF]">
                Your report is being processed by our AI system.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-[#F87171]/10 border border-[#F87171]/30 rounded-lg">
          <div className="flex items-center gap-2 text-[#F87171]">
            <span className="text-xl">❌</span>
            <p>{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-[#E5E7EB] mb-2 uppercase tracking-wide">
            Pothole Image *
          </label>
          <div className="mt-1">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-[#1F2937]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview("");
                  }}
                  className="absolute top-2 right-2 bg-[#F87171] text-white px-3 py-1 rounded-md text-sm hover:bg-[#F87171]/80"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-[#1F2937] border-dashed rounded-lg cursor-pointer hover:bg-[#0A0F1A] hover:border-[#22C55E]/50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-12 h-12 mb-3 text-[#9CA3AF]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-[#9CA3AF]">
                    <span className="font-semibold text-[#22C55E]">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    PNG, JPG, WEBP (MAX. 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </label>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-[#E5E7EB] mb-2 uppercase tracking-wide">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., Large pothole on Main Street"
            className="w-full px-4 py-2 bg-[#0A0F1A] border border-[#1F2937] rounded-md focus:ring-2 focus:ring-[#22C55E]/50 focus:border-[#22C55E] text-[#E5E7EB] placeholder:text-[#9CA3AF]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-[#E5E7EB] mb-2 uppercase tracking-wide">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe the location, size, or any additional details..."
            rows={3}
            className="w-full px-4 py-2 bg-[#0A0F1A] border border-[#1F2937] rounded-md focus:ring-2 focus:ring-[#22C55E]/50 focus:border-[#22C55E] text-[#E5E7EB] placeholder:text-[#9CA3AF]"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-[#E5E7EB] mb-2 uppercase tracking-wide">
            Location *
          </label>
          <div className="space-y-3">
            {/* Toggle Map Button */}
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30 rounded-md hover:bg-[#3b82f6]/20 transition"
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
              {showMap ? "Hide Map" : "Pick Location on Map"}
            </button>

            {/* Interactive Map */}
            {showMap && (
              <div className="animate-fadeIn">
                <LocationPickerMap
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onLocationSelect={(lat, lng) => {
                    setFormData({
                      ...formData,
                      latitude: lat.toFixed(6),
                      longitude: lng.toFixed(6),
                    });
                  }}
                  height="400px"
                />
              </div>
            )}

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1F2937]"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#141B2A] px-2 text-[#9CA3AF]">Or</span>
              </div>
            </div>

            {/* Use Current Location Button */}
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 rounded-md hover:bg-[#2DD4BF]/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {gettingLocation
                ? "Getting Location..."
                : "Use Current GPS Location"}
            </button>

            {/* Manual Coordinate Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  placeholder="Latitude"
                  required
                  className="w-full px-4 py-2 bg-[#0A0F1A] border border-[#1F2937] rounded-md focus:ring-2 focus:ring-[#22C55E]/50 focus:border-[#22C55E] text-[#E5E7EB] placeholder:text-[#9CA3AF]"
                />
              </div>
              <div>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  placeholder="Longitude"
                  required
                  className="w-full px-4 py-2 bg-[#0A0F1A] border border-[#1F2937] rounded-md focus:ring-2 focus:ring-[#22C55E]/50 focus:border-[#22C55E] text-[#E5E7EB] placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#22C55E] text-black py-3 px-4 rounded-md hover:bg-[#22C55E]/80 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all uppercase tracking-wide"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Report"
          )}
        </button>
      </form>
    </div>
  );
}
