'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const SimpleWorkerNav = dynamic(() => import('@/components/SimpleWorkerNav'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading navigation...</div>
    </div>
  ),
})

interface WorkerTaskCardProps {
  task: {
    id: string
    ticketNumber: string
    status: string
    pothole: {
      id: string
      latitude: number
      longitude: number
      priorityLevel: string | null
      imageUrl: string | null
      roadInfo: {
        roadName: string | null
      } | null
    }
  }
  workerLocation: {
    latitude: number
    longitude: number
  } | null
  onRefresh: () => void
}

export default function WorkerTaskCard({ task, workerLocation, onRefresh }: WorkerTaskCardProps) {
  const [showNavigation, setShowNavigation] = useState(false)
  const [showProofUpload, setShowProofUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB')
        return
      }
      
      setSelectedFile(file)
      setUploadError('')
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleProofUpload() {
    if (!selectedFile) {
      setUploadError('Please select an image')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      // Upload to Cloudinary via our API
      const formData = new FormData()
      formData.append('file', selectedFile)

      const uploadRes = await fetch('/api/upload/proof', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Upload failed')
      }

      // Submit proof to ticket
      const proofRes = await fetch(`/api/tickets/${task.id}/proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrls: [uploadData.fileUrl || uploadData.cloudinaryUrl],
          notes: 'Work completed',
        }),
      })

      const proofData = await proofRes.json()

      if (!proofData.success) {
        throw new Error(proofData.error || 'Failed to submit proof')
      }

      alert('Proof uploaded successfully! Awaiting admin verification.')
      setShowProofUpload(false)
      setSelectedFile(null)
      setPreviewUrl(null)
      onRefresh()

    } catch (err: any) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const getPriorityColor = (level: string | null) => {
    switch (level) {
      case 'CRITICAL': return 'bg-[#FF1744]/20 text-[#FF1744] border border-[#FF1744]/50'
      case 'HIGH': return 'bg-[#FF9100]/20 text-[#FF9100] border border-[#FF9100]/50'
      case 'MEDIUM': return 'bg-[#FFC400]/20 text-[#FFC400] border border-[#FFC400]/50'
      case 'LOW': return 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/50'
      default: return 'bg-[#94A3B8]/20 text-[#94A3B8] border border-[#94A3B8]/50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
      case 'IN_PROGRESS': return 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
      case 'AWAITING_VERIFICATION': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
      case 'VERIFIED': return 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/50'
      default: return 'bg-[#94A3B8]/20 text-[#94A3B8] border border-[#94A3B8]/50'
    }
  }

  return (
    <div className="bg-[#0B1220] border border-[#1F2937] rounded-xl p-6 hover:border-[#00E676]/50 transition duration-300 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E676]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide">
            {task.pothole.roadInfo?.roadName || 'UNKNOWN_SECTOR'}
          </h3>
          <p className="text-xs font-mono text-[#94A3B8]">TICKET_ID: #{task.ticketNumber}</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {task.pothole.priorityLevel && (
            <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${getPriorityColor(task.pothole.priorityLevel)}`}>
              {task.pothole.priorityLevel}
            </span>
          )}
          <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${getStatusColor(task.status)}`}>
            {task.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm bg-[#050B16] p-3 rounded border border-[#1F2937]">
        <div>
          <span className="text-xs text-[#94A3B8] uppercase">Location Coords</span>
          <div className="font-mono text-[#00E676]">
            {task.pothole.latitude.toFixed(6)}, {task.pothole.longitude.toFixed(6)}
          </div>
        </div>
      </div>

      {/* Pothole Image */}
      {task.pothole.imageUrl && (
        <div className="mb-4 relative group/img overflow-hidden rounded border border-[#1F2937]">
          <div className="absolute inset-0 bg-green-500/10 mix-blend-overlay pointer-events-none" />
          <img
            src={task.pothole.imageUrl}
            alt="Target"
            className="w-full h-48 object-cover opacity-80 group-hover/img:opacity-100 transition"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-[10px] text-[#00E676] font-mono border border-[#00E676]/30">
            IMG_SOURCE: DRONE_V2
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setShowNavigation(!showNavigation)}
          className="flex-1 bg-[#00B8D4]/10 border border-[#00B8D4]/50 text-[#00B8D4] px-4 py-3 rounded hover:bg-[#00B8D4] hover:text-black transition font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          {showNavigation ? '❌ ABORT_NAV' : '🗺️ INITIATE_NAV'}
        </button>

        {task.status === 'ASSIGNED' || task.status === 'IN_PROGRESS' ? (
          <button
            onClick={() => setShowProofUpload(!showProofUpload)}
            className="flex-1 bg-[#00E676] text-black px-4 py-3 rounded hover:bg-[#00E676]/80 transition font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            📸 UPLOAD_PROOF
          </button>
        ) : task.status === 'AWAITING_VERIFICATION' ? (
          <div className="flex-1 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 px-4 py-3 rounded text-center text-xs font-bold uppercase tracking-wider">
            ⏳ VERIFICATION_PENDING
          </div>
        ) : null}

        <Link
          href={`/potholes/${task.pothole.id}`}
          className="px-4 py-3 bg-[#1F2937] text-white border border-[#374151] rounded hover:border-white transition font-bold text-xs uppercase tracking-wider flex items-center justify-center"
        >
          DETAILS
        </Link>
      </div>

      {/* Navigation Map */}
      {showNavigation && workerLocation && (
        <div className="mt-4 border-t border-[#1F2937] pt-4">
          <h4 className="font-bold text-[#00B8D4] text-xs uppercase mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00B8D4] rounded-full animate-ping"></span>
            ACTIVE NAVIGATION SEQUENCE
          </h4>
          <div className="rounded border border-[#00B8D4]/30 overflow-hidden">
             <SimpleWorkerNav
                workerLocation={workerLocation}
                potholeLocation={{
                   latitude: task.pothole.latitude,
                   longitude: task.pothole.longitude,
                }}
             />
          </div>
        </div>
      )}

      {showNavigation && !workerLocation && (
        <div className="mt-4 bg-[#FF1744]/10 border border-[#FF1744]/30 rounded p-4 text-center">
          <p className="text-[#FF1744] text-xs font-bold uppercase tracking-wider">
            ⚠️ GPS SIGNAL REQUIRED FOR NAVIGATION
          </p>
        </div>
      )}

      {/* Proof Upload Section */}
      {showProofUpload && (
        <div className="mt-4 border-t border-[#1F2937] pt-4">
          <h4 className="font-bold text-[#00E676] text-xs uppercase mb-3">📸 COMPLETION_PROOF_UPLOAD</h4>
          
          {uploadError && (
            <div className="mb-3 bg-[#FF1744]/10 border border-[#FF1744]/50 text-[#FF1744] px-3 py-2 rounded text-xs font-mono">
              ERROR: {uploadError}
            </div>
          )}

          <div className="space-y-3">
            {/* File Input */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">
                SELECT_IMAGE_FILE
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full text-xs text-[#94A3B8] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#1F2937] file:text-white hover:file:bg-[#374151] cursor-pointer bg-[#050B16] rounded border border-[#1F2937]"
              />
            </div>

            {/* Preview */}
            {previewUrl && (
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">
                  PREVIEW_STREAM
                </label>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded border border-[#00E676]/30"
                />
              </div>
            )}

            {/* Upload Button */}
            <div className="flex gap-2">
              <button
                onClick={handleProofUpload}
                disabled={!selectedFile || uploading}
                className="flex-1 bg-[#00E676] text-black px-4 py-2 rounded hover:bg-[#00E676]/80 disabled:bg-[#1F2937] disabled:text-[#94A3B8] transition font-bold text-xs uppercase tracking-wider"
              >
                {uploading ? 'UPLOADING...' : '✓ CONFIRM_SUBMISSION'}
              </button>
              <button
                onClick={() => {
                  setShowProofUpload(false)
                  setSelectedFile(null)
                  setPreviewUrl(null)
                  setUploadError('')
                }}
                className="px-4 py-2 bg-[#1F2937] text-white border border-[#374151] rounded hover:bg-[#374151] transition font-bold text-xs uppercase tracking-wider"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
