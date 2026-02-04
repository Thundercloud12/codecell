"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ProofUploadPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.ticketId as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    images: [] as File[],
    notes: "",
  });

  // Drag and drop handlers
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        addImageFile(file);
      }
    });
  }

  function addImageFile(file: File) {
    setFormData({
      ...formData,
      images: [...formData.images, file],
    });
  }

  function removeImageFile(index: number) {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          addImageFile(file);
        }
      });
    }
    // Clear the input so the same file can be selected again if needed
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (formData.images.length === 0) {
        setError("At least one image is required");
        setLoading(false);
        return;
      }

      // Upload each image file and collect URLs
      const imageUrls: string[] = [];
      setUploadProgress(new Array(formData.images.length).fill(0));

      for (let i = 0; i < formData.images.length; i++) {
        const file = formData.images[i];
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("type", "work-proof");

        // Set progress to indicate upload starting
        setUploadProgress((prev) => {
          const newProgress = [...prev];
          newProgress[i] = 10;
          return newProgress;
        });

        const uploadRes = await fetch("/api/upload/proof", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error || `Failed to upload ${file.name}`);
        }

        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrls.push(uploadData.cloudinaryUrl || uploadData.fileUrl);
          setUploadProgress((prev) => {
            const newProgress = [...prev];
            newProgress[i] = 100;
            return newProgress;
          });
          console.log(
            `✅ Uploaded ${file.name} to Cloudinary: ${uploadData.cloudinaryUrl}`,
          );
        } else {
          throw new Error(uploadData.error || `Failed to upload ${file.name}`);
        }
      }

      // Submit proof with uploaded image URLs
      const res = await fetch(`/api/tickets/${ticketId}/proof`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrls,
          notes: formData.notes || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/tickets/${ticketId}`);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload proof");
    } finally {
      setLoading(false);
      setUploadProgress([]);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href={`/tickets/${ticketId}`}
          className="inline-flex items-center gap-2 text-[#1E3A5F] hover:text-[#2E7D32] transition-colors mb-8 font-medium"
        >
          ← Back to Ticket
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-black italic uppercase mb-2">
            <span className="text-[#1E3A5F]">Upload Work </span>
            <span className="bg-gradient-to-r from-[#2E7D32] to-[#1565C0] bg-clip-text text-transparent">
              Proof
            </span>
          </h1>
          <p className="text-[#5A6C7D]">
            Submit images and notes to verify completed work
          </p>
        </div>

        {error && (
          <div className="bg-[#D32F2F]/10 border border-[#D32F2F] text-[#D32F2F] px-4 py-3 rounded-lg mb-6 shadow-sm">
            {error}
          </div>
        )}

        <div className="bg-[#1565C0]/5 border-l-4 border-[#1565C0] p-4 rounded mb-8 shadow-sm">
          <p className="text-sm text-[#1E3A5F]">
            <strong className="font-bold">📸 Upload Images:</strong> Select
            images from your device to provide proof of completed work.
            Supported formats: JPEG, PNG.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#1E3A5F] mb-3 uppercase tracking-wide">
              Work Proof Images *
            </label>

            {/* File Upload Input */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors bg-white shadow-sm ${
                isDragging
                  ? "border-[#2E7D32] bg-[#2E7D32]/5"
                  : "border-[#D4D1C8] hover:border-[#1565C0]"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer inline-flex flex-col items-center space-y-2"
              >
                <svg
                  className="w-16 h-16 text-[#5A6C7D] mb-3"
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
                <span className="text-base text-[#1E3A5F] font-medium">
                  {isDragging
                    ? "Drop images here"
                    : "Click to upload images or drag and drop"}
                </span>
                <span className="text-sm text-[#5A6C7D]">
                  PNG, JPG up to 10MB each
                </span>
              </label>
            </div>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-[#1E3A5F] uppercase tracking-wide">
                  Selected Images ({formData.images.length}):
                </h4>
                {formData.images.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white border border-[#D4D1C8] p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-[#D4D1C8]"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#1E3A5F]">
                          {file.name}
                        </p>
                        <p className="text-xs text-[#5A6C7D] font-mono">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImageFile(index)}
                      className="bg-[#D32F2F] text-white px-4 py-2 rounded-lg text-sm font-bold uppercase hover:bg-[#D32F2F]/90 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Progress */}
            {uploadProgress.length > 0 && (
              <div className="space-y-3 mt-4">
                <h4 className="text-sm font-bold text-[#1E3A5F] uppercase tracking-wide">
                  Uploading...
                </h4>
                {uploadProgress.map((progress, index) => (
                  <div
                    key={index}
                    className="w-full bg-[#D4D1C8] rounded-full h-3"
                  >
                    <div
                      className="bg-gradient-to-r from-[#2E7D32] to-[#1565C0] h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1E3A5F] mb-2 uppercase tracking-wide">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full bg-white border border-[#D4D1C8] rounded-lg px-4 py-3 focus:outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 text-[#1E3A5F] transition"
              rows={5}
              placeholder="Describe the work completed..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#2E7D32] to-[#1565C0] text-white py-4 rounded-lg font-black italic uppercase text-lg hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all"
          >
            {loading ? "Uploading..." : "Submit Proof"}
          </button>
        </form>
      </div>
    </div>
  );
}
