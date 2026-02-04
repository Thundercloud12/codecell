"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Upload, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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
      <div className="min-h-screen bg-[#050B16] flex items-center justify-center p-4">
        <div className="bg-[#0B1220] border border-[#00E676] rounded-xl shadow-[0_0_50px_rgba(0,230,118,0.2)] p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-[#00E676]/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-[#00E676]" />
          </div>
          <h2 className="text-3xl font-black italic text-white mb-2 uppercase tracking-tighter">Transmission Complete</h2>
          <p className="text-[#94A3B8] mb-8 font-mono text-sm leading-relaxed">
            Data packet received. Central Command is analyzing the telemetry.
            Thank you for your contribution to the grid safety protocols.
          </p>
          <div className="text-xs text-[#00E676] font-mono animate-pulse">
            REDIRECTING_TO_ARCHIVES...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B16] text-white">
      <nav className="bg-[#050B16]/90 border-b border-[#1F2937] backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/citizen"
              className="text-[#94A3B8] hover:text-[#00E676] flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold uppercase text-xs tracking-wider">Abort Mission</span>
            </Link>
            <h1 className="text-xl font-bold uppercase tracking-widest text-[#00E676]">
              New Hazard Report
            </h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="bg-[#0B1220] border border-[#1F2937] rounded-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E676] to-transparent"></div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2 uppercase tracking-wide">Hazard Data Entry</h2>
            <p className="text-[#94A3B8] text-sm font-mono">
              ENTER COORDINATES AND VISUAL EVIDENCE FOR ANALYSIS
            </p>
          </div>

          {error && (
            <div className="mb-8 bg-[#FF1744]/10 border border-[#FF1744]/30 rounded p-4 text-[#FF1744] font-mono text-sm">
              ERROR: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Event Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SECTOR 7 ROAD DAMAGE"
                className="w-full px-4 py-3 bg-[#050B16] border border-[#1F2937] text-white rounded focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] outline-none font-mono text-sm placeholder:text-[#94A3B8]/30 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Description (Optional)
              </label>
              <textarea
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 placeholder="PROVIDE ADDITIONAL CONTEXT..."
                 rows={4}
                 className="w-full px-4 py-3 bg-[#050B16] border border-[#1F2937] text-white rounded focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] outline-none font-mono text-sm placeholder:text-[#94A3B8]/30 transition resize-none"
               />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                   Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                  placeholder="00.0000"
                  className="w-full px-4 py-3 bg-[#050B16] border border-[#1F2937] text-[#00E676] rounded focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] outline-none font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                   Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                  placeholder="00.0000"
                  className="w-full px-4 py-3 bg-[#050B16] border border-[#1F2937] text-[#00E676] rounded focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] outline-none font-mono text-sm"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="flex items-center gap-2 px-4 py-2 bg-[#00B8D4]/10 text-[#00B8D4] border border-[#00B8D4]/30 rounded hover:bg-[#00B8D4]/20 transition disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs font-bold uppercase tracking-wider"
            >
              {gettingLocation ? (
                 <>
                   <Loader2 className="w-4 h-4 animate-spin" />
                   ACQUIRING_SATELLITE_LOCK...
                 </>
               ) : (
                 <>
                   <MapPin className="w-4 h-4" />
                   AUTO_DETECT_COORDS
                 </>
               )}
            </button>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                 Visual Evidence (Optional)
              </label>
              <div className="border-2 border-dashed border-[#1F2937] bg-[#050B16]/50 rounded-xl p-8 text-center hover:border-[#00E676]/50 transition cursor-pointer group">
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
                         alt="Pre-transmission"
                         className="max-h-64 rounded-lg border border-[#00E676]/30 mx-auto"
                       />
                       <button
                         type="button"
                         onClick={(e) => {
                           e.preventDefault();
                           setImageFile(null);
                           setImagePreview("");
                         }}
                         className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full p-2 hover:bg-red-600 transition backdrop-blur"
                       >
                         ✕
                       </button>
                    </div>
                  ) : (
                    <>
                       <Upload className="w-12 h-12 text-[#94A3B8] mb-4 group-hover:text-[#00E676] group-hover:scale-110 transition duration-300" />
                       <span className="text-white font-bold uppercase tracking-wide group-hover:text-[#00E676] transition">
                         Initiate File Upload
                       </span>
                       <span className="text-xs text-[#94A3B8] font-mono mt-2">
                         SUPPORTED FORMATS: PNG, JPG (MAX 10MB)
                       </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || !latitude || !longitude}
                className="flex-1 bg-[#00E676] text-black px-6 py-4 rounded font-bold hover:bg-[#00E676]/80 disabled:bg-[#1F2937] disabled:text-[#94A3B8] disabled:cursor-not-allowed transition flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    TRANSMITTING...
                  </>
                ) : (
                  "CONFIRM TRANSMISSION"
                )}
              </button>

              <Link
                href="/citizen"
                className="px-6 py-4 border border-[#374151] text-[#94A3B8] rounded font-bold hover:border-white hover:text-white transition text-center uppercase tracking-wider text-sm"
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
