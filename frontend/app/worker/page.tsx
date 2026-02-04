'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import map component
const SimpleWorkerNav = dynamic(() => import('@/components/SimpleWorkerNav'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-[#0B1220] rounded-lg flex items-center justify-center border border-[#1F2937]">
      <div className="text-[#00E676] font-mono animate-pulse">LOADING_NAV_MODULE...</div>
    </div>
  ),
})

interface Pothole {
  id: string
  latitude: number
  longitude: number
  priorityLevel: string | null
  priorityScore: number | null
  imageUrl: string | null
  roadInfo: {
    roadName: string | null
    roadType: string | null
  } | null
}

interface Task {
  id: string
  ticketNumber: string
  status: string
  assignedAt: string | null
  potholes: Pothole[]
  workProofs: Array<{
    id: string
    submittedAt: string
    isApproved: boolean | null
  }>
}

interface WorkerData {
  id: string
  name: string
  email: string
  employeeId: string
  currentLatitude: number | null
  currentLongitude: number | null
}

export default function WorkerDashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [worker, setWorker] = useState<WorkerData | null>(null)
  const [workerLocation, setWorkerLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationError, setLocationError] = useState('')
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [uploadingProof, setUploadingProof] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && user) {
      fetchWorkerData()
      requestLocation()
    }
  }, [isLoaded, user])

  function requestLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setWorkerLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setLocationError('')
        },
        (error) => {
          setLocationError('Location access denied. Please enable location to use navigation.')
          console.error('Location error:', error)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    } else {
      setLocationError('Geolocation is not supported by your browser')
    }
  }

  async function fetchWorkerData() {
    if (!user?.primaryEmailAddress?.emailAddress) {
      setLoading(false)
      setError('No email address found for your account')
      return
    }

    try {
      setLoading(true)
      setError('')

      // First, try to find the worker by email
      const workerRes = await fetch('/api/workers')
      const workerData = await workerRes.json()

      if (!workerData.success) {
        setError('Failed to fetch worker data')
        setLoading(false)
        return
      }

      const matchedWorker = workerData.workers.find((w: WorkerData) => 
        w.email.toLowerCase() === user.primaryEmailAddress!.emailAddress.toLowerCase()
      )

      if (!matchedWorker) {
        setError('No worker profile linked to your account. Please contact an administrator.')
        setLoading(false)
        return
      }

      setWorker(matchedWorker)

      // Now fetch tasks for this worker
      const tasksRes = await fetch(`/api/workers/${matchedWorker.id}/tasks`)
      const tasksData = await tasksRes.json()

      if (tasksData.success) {
        setTasks(tasksData.tasks || [])
      } else {
        setError(tasksData.error || 'Failed to fetch tasks')
      }
    } catch (err) {
      console.error('Failed to fetch worker data:', err)
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  async function updateLocation() {
    if (!worker || !workerLocation) return

    try {
      setActionLoading(true)
      const res = await fetch(`/api/workers/${worker.id}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: workerLocation.latitude,
          longitude: workerLocation.longitude,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setWorker(prev => prev ? { ...prev, currentLatitude: workerLocation.latitude, currentLongitude: workerLocation.longitude } : null)
      }
    } catch (err) {
      console.error('Failed to update location:', err)
    } finally {
      setActionLoading(false)
    }
  }

  async function startJob(ticketId: string) {
    if (!worker) return

    try {
      setActionLoading(true)
      const res = await fetch(`/api/workers/${worker.id}/start-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }),
      })
      const data = await res.json()
      if (data.success) {
        fetchWorkerData()
      } else {
        alert(data.error || 'Failed to start job')
      }
    } catch (err) {
      console.error('Failed to start job:', err)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleProofUpload(ticketId: string, file: File) {
    if (!worker) return

    try {
      setUploadingProof(ticketId)

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/upload/proof', {
        method: 'POST',
        body: formData,
      })
      const uploadData = await uploadRes.json()

      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Upload failed')
      }

      // Submit proof
      const proofRes = await fetch(`/api/tickets/${ticketId}/proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrls: [uploadData.fileUrl || uploadData.cloudinaryUrl],
          notes: 'Work completed',
          latitude: workerLocation?.latitude,
          longitude: workerLocation?.longitude,
        }),
      })
      const proofData = await proofRes.json()

      if (proofData.success) {
        alert('Proof uploaded! Awaiting admin verification.')
        fetchWorkerData()
      } else {
        throw new Error(proofData.error || 'Failed to submit proof')
      }
    } catch (err: any) {
      alert(err.message || 'Upload failed')
    } finally {
      setUploadingProof(null)
    }
  }

  const taskStats = {
    assigned: tasks.filter(t => t.status === 'ASSIGNED').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    awaiting: tasks.filter(t => t.status === 'AWAITING_VERIFICATION').length,
  }

  const getPriorityColor = (level: string | null) => {
    switch (level) {
      case 'CRITICAL': return 'bg-[#FF1744]/20 text-[#FF1744] border-[#FF1744]/50'
      case 'HIGH': return 'bg-[#FF9100]/20 text-[#FF9100] border-[#FF9100]/50'
      case 'MEDIUM': return 'bg-[#FFC400]/20 text-[#FFC400] border-[#FFC400]/50'
      case 'LOW': return 'bg-[#00E676]/20 text-[#00E676] border-[#00E676]/50'
      default: return 'bg-[#94A3B8]/20 text-[#94A3B8] border-[#94A3B8]/50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'IN_PROGRESS': return 'bg-purple-500/20 text-purple-400 border-purple-500/50'
      case 'AWAITING_VERIFICATION': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      default: return 'bg-[#94A3B8]/20 text-[#94A3B8] border-[#94A3B8]/50'
    }
  }

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#050B16] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00E676] mx-auto mb-4"></div>
          <p className="text-[#00E676] font-mono animate-pulse">AUTHENTICATING OPERATIVE...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050B16] text-white">
      {/* Header */}
      <nav className="bg-[#050B16]/90 border-b border-[#1F2937] sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC400] to-[#FF9100] flex items-center justify-center text-black font-bold text-lg">
              W
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-widest uppercase">Field Operative</h1>
              <p className="text-xs text-[#94A3B8] font-mono">
                UNIT: {worker?.name?.toUpperCase() || user?.firstName?.toUpperCase() || 'UNKNOWN'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {worker && (
              <span className="text-xs font-mono text-[#94A3B8] bg-[#1F2937] px-3 py-1 rounded-full">
                ID: {worker.employeeId}
              </span>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Error State */}
        {error && (
          <div className="bg-[#FF1744]/10 border border-[#FF1744]/30 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-bold text-[#FF1744] uppercase">System Error</div>
                <div className="text-sm text-[#FF1744]/70">{error}</div>
              </div>
            </div>
            <button
              onClick={fetchWorkerData}
              className="mt-4 px-4 py-2 bg-[#FF1744]/20 border border-[#FF1744]/50 text-[#FF1744] hover:bg-[#FF1744] hover:text-white rounded-lg transition text-sm font-bold uppercase"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Location Status */}
        {workerLocation ? (
          <div className="bg-[#00E676]/10 border border-[#00E676]/30 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#00E676] animate-pulse"></span>
              <div>
                <div className="font-bold text-[#00E676] text-sm tracking-wider uppercase">GPS Tracking Active</div>
                <div className="text-xs text-[#00E676]/70 font-mono">
                  LAT: {workerLocation.latitude.toFixed(6)} | LNG: {workerLocation.longitude.toFixed(6)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={requestLocation}
                className="text-xs text-[#00E676] hover:text-white font-mono px-3 py-1 border border-[#00E676]/30 rounded hover:bg-[#00E676]/20 transition"
              >
                REFRESH
              </button>
              <button
                onClick={updateLocation}
                disabled={actionLoading}
                className="text-xs bg-[#00E676] text-black font-bold px-3 py-1 rounded hover:bg-[#00E676]/80 transition disabled:opacity-50"
              >
                {actionLoading ? 'SYNCING...' : 'SYNC TO SERVER'}
              </button>
            </div>
          </div>
        ) : locationError ? (
          <div className="bg-[#FF1744]/10 border border-[#FF1744]/30 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <div className="font-bold text-[#FF1744] text-sm uppercase">⚠️ GPS Signal Lost</div>
              <div className="text-xs text-[#FF1744]/70">{locationError}</div>
            </div>
            <button
              onClick={requestLocation}
              className="px-4 py-2 bg-[#FF1744]/20 border border-[#FF1744]/50 text-[#FF1744] hover:bg-[#FF1744] hover:text-white rounded-lg transition text-xs font-bold uppercase"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-[#1F2937]/50 border border-[#1F2937] rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#00E676]"></div>
              <span className="text-[#94A3B8] text-sm font-mono">ACQUIRING GPS SIGNAL...</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: '📋', label: 'Assigned', val: taskStats.assigned, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
            { icon: '⚙️', label: 'In Progress', val: taskStats.inProgress, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
            { icon: '⏳', label: 'Awaiting Review', val: taskStats.awaiting, color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} p-5 rounded-xl border ${stat.border}`}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">{stat.label}</div>
              <div className={`text-3xl font-black ${stat.color} font-mono`}>{stat.val}</div>
            </div>
          ))}
        </div>

        {/* No Worker Profile */}
        {!worker && !error && (
          <div className="bg-[#1F2937]/50 border border-yellow-500/30 rounded-xl p-8 text-center backdrop-blur-sm">
            <p className="text-yellow-400 font-bold mb-2 text-lg">⚠️ PROFILE NOT LINKED</p>
            <p className="text-sm text-[#94A3B8]">Your account is not linked to a worker profile.</p>
            <p className="text-sm text-[#94A3B8]">Contact Command Center (Admin) to get assigned.</p>
          </div>
        )}

        {/* Tasks Section */}
        {worker && tasks.length === 0 && (
          <div className="bg-[#0B1220] rounded-xl border border-[#1F2937] p-12 text-center">
            <div className="text-6xl mb-6 opacity-20">📡</div>
            <h3 className="text-xl font-bold text-white mb-2">No Active Missions</h3>
            <p className="text-[#94A3B8]">Standby for new assignments from Command Center.</p>
            <button
              onClick={fetchWorkerData}
              className="mt-6 px-6 py-2 bg-[#1F2937] text-[#00E676] border border-[#00E676]/30 rounded-lg hover:bg-[#00E676]/10 transition font-mono text-sm"
            >
              CHECK FOR UPDATES
            </button>
          </div>
        )}

        {worker && tasks.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="w-1 h-6 bg-[#00E676] rounded-full"></span>
              MISSION LOG
              <span className="text-xs text-[#94A3B8] font-mono py-1 px-3 bg-[#1F2937] rounded-full">
                {tasks.length} ACTIVE
              </span>
              <button
                onClick={fetchWorkerData}
                className="ml-auto text-xs text-[#00E676] font-mono hover:underline"
              >
                ↻ REFRESH
              </button>
            </h2>

            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-[#0B1220] border border-[#1F2937] rounded-xl overflow-hidden hover:border-[#00E676]/50 transition group"
              >
                {/* Task Header */}
                <div className="p-5 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-lg font-bold text-white">{task.ticketNumber}</span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.potholes[0]?.priorityLevel)}`}>
                        {task.potholes[0]?.priorityLevel || 'UNRANKED'}
                      </span>
                    </div>
                    <div className="text-sm text-[#94A3B8]">
                      📍 {task.potholes[0]?.roadInfo?.roadName || 'Unknown Road'}
                      {task.potholes[0]?.roadInfo?.roadType && (
                        <span className="text-xs text-[#6B7280]"> ({task.potholes[0].roadInfo.roadType})</span>
                      )}
                    </div>
                    <div className="text-xs text-[#6B7280] font-mono mt-1">
                      COORDS: {task.potholes[0]?.latitude?.toFixed(6) || 'N/A'}, {task.potholes[0]?.longitude?.toFixed(6) || 'N/A'}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    className="text-[#00E676] hover:text-white transition p-2"
                  >
                    {expandedTask === task.id ? '▲' : '▼'}
                  </button>
                </div>

                {/* Expanded Content */}
                {expandedTask === task.id && (
                  <div className="border-t border-[#1F2937] p-5 space-y-4">
                    {/* Navigation Map */}
                    {workerLocation && task.potholes[0] && (
                      <div className="rounded-xl overflow-hidden border border-[#1F2937]">
                        <SimpleWorkerNav
                          workerLocation={workerLocation}
                          potholeLocation={{
                            latitude: task.potholes[0].latitude,
                            longitude: task.potholes[0].longitude,
                          }}
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {task.status === 'ASSIGNED' && (
                        <button
                          onClick={() => startJob(task.id)}
                          disabled={actionLoading}
                          className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {actionLoading ? '⏳ Starting...' : '🚀 START JOB'}
                        </button>
                      )}

                      {task.status === 'IN_PROGRESS' && (
                        <label className="flex-1 bg-[#00E676] text-black px-4 py-3 rounded-xl font-bold hover:bg-[#00E676]/80 transition cursor-pointer flex items-center justify-center gap-2">
                          {uploadingProof === task.id ? (
                            <>⏳ Uploading...</>
                          ) : (
                            <>📸 UPLOAD PROOF</>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleProofUpload(task.id, file)
                            }}
                            disabled={uploadingProof === task.id}
                          />
                        </label>
                      )}

                      {task.status === 'AWAITING_VERIFICATION' && (
                        <div className="flex-1 bg-yellow-500/20 text-yellow-400 px-4 py-3 rounded-xl font-bold text-center border border-yellow-500/30">
                          ⏳ Awaiting Admin Review
                        </div>
                      )}

                      {task.potholes[0] && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${task.potholes[0].latitude},${task.potholes[0].longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#1F2937] text-white px-4 py-3 rounded-xl font-bold hover:bg-[#374151] transition flex items-center gap-2"
                        >
                          🗺️ Open in Maps
                        </a>
                      )}
                    </div>

                    {/* Proof History */}
                    {task.workProofs.length > 0 && (
                      <div className="bg-[#1F2937]/50 rounded-lg p-4">
                        <div className="text-xs text-[#94A3B8] uppercase mb-2">Submitted Proofs</div>
                        {task.workProofs.map((proof) => (
                          <div key={proof.id} className="flex items-center gap-2 text-sm">
                            <span className={proof.isApproved === true ? 'text-green-400' : proof.isApproved === false ? 'text-red-400' : 'text-yellow-400'}>
                              {proof.isApproved === true ? '✓' : proof.isApproved === false ? '✗' : '⏳'}
                            </span>
                            <span className="text-[#94A3B8]">
                              {new Date(proof.submittedAt).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}