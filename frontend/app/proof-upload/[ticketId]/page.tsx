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
      if (file.type.startsWith('image/')) {
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
        if (file.type.startsWith('image/')) {
          addImageFile(file);
        }
      });
    }
    // Clear the input so the same file can be selected again if needed
    e.target.value = '';
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
        uploadFormData.append('file', file);
        uploadFormData.append('type', 'work-proof');
        
        // Set progress to indicate upload starting
        setUploadProgress(prev => {
          const newProgress = [...prev];
          newProgress[i] = 10;
          return newProgress;
        });
        
        const uploadRes = await fetch('/api/upload/proof', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error || `Failed to upload ${file.name}`);
        }

        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrls.push(uploadData.cloudinaryUrl || uploadData.fileUrl);
          setUploadProgress(prev => {
            const newProgress = [...prev];
            newProgress[i] = 100;
            return newProgress;
          });
          console.log(`✅ Uploaded ${file.name} to Cloudinary: ${uploadData.cloudinaryUrl}`);
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
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        href={`/tickets/${ticketId}`}
        className="text-blue-600 mb-4 inline-block"
      >
        ← Back to Ticket
      </Link>

      <h1 className="text-3xl font-bold mb-6">Upload Work Proof</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
        <p className="text-sm text-blue-800">
          <strong>📸 Upload Images:</strong> Select images from your device to provide proof of completed work. Supported formats: JPEG, PNG.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Work Proof Images *</label>
          
          {/* File Upload Input */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
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
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm text-gray-600">
                {isDragging ? 'Drop images here' : 'Click to upload images or drag and drop'}
              </span>
              <span className="text-xs text-gray-500">PNG, JPG up to 10MB each</span>
            </label>
          </div>

          {/* Image Preview */}
          {formData.images.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Selected Images ({formData.images.length}):</h4>
              {formData.images.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center space-x-3">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImageFile(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium">Uploading...</h4>
              {uploadProgress.map((progress, index) => (
                <div key={index} className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Describe the work completed..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Submit Proof"}
        </button>
      </form>
    </div>
  );
}
