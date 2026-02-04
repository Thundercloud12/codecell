'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import WorkerTaskCard from '@/components/WorkerTaskCard'

interface Task {
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

export default function WorkerDashboardPage() {
  const { user } = useUser()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [workerId, setWorkerId] = useState<string | null>(null)
  const [workerLocation, setWorkerLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationError, setLocationError] = useState('')

  useEffect(() => {
    fetchWorkerTasks()
    requestLocation()
  }, [user])

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
        }
      )
    } else {
      setLocationError('Geolocation is not supported by your browser')
    }
  }

  async function fetchWorkerTasks() {
    try {
      const workerRes = await fetch('/api/workers')
      const workerData = await workerRes.json()

      if (workerData.success && workerData.workers.length > 0) {
        const worker = workerData.workers.find((w: any) => 
          w.email === user?.primaryEmailAddress?.emailAddress
        )

        if (worker) {
          setWorkerId(worker.id)

          const tasksRes = await fetch(`/api/workers/${worker.id}/tasks`)
          const tasksData = await tasksRes.json()

          if (tasksData.success) {
            setTasks(tasksData.tasks || [])
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const taskStats = {
    assigned: tasks.filter(t => t.status === 'ASSIGNED').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    awaiting: tasks.filter(t => t.status === 'AWAITING_VERIFICATION').length,
    verified: tasks.filter(t => t.status === 'VERIFIED').length,
  }

  return (
    <div className="min-h-screen bg-[#050B16] text-white">
      {/* Header */}
      <nav className="bg-[#050B16]/90 border-b border-[#1F2937] sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-[#FFC400] flex items-center justify-center text-black font-bold">W</div>
             <div>
               <h1 className="text-xl font-bold text-white tracking-widest uppercase">Field Operative</h1>
               <p className="text-xs text-[#94A3B8] font-mono">UNIT: {user?.firstName?.toUpperCase()}</p>
             </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Location Status */}
        {workerLocation ? (
          <div className="bg-[#00E676]/10 border border-[#00E676]/30 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
              <div>
                <div className="font-bold text-[#00E676] text-sm tracking-wider uppercase">GPS Tracking Active</div>
                <div className="text-xs text-[#00E676]/70 font-mono">
                  LAT: {workerLocation.latitude.toFixed(6)} | LNG: {workerLocation.longitude.toFixed(6)}
                </div>
              </div>
            </div>
            <button
              onClick={requestLocation}
              className="text-xs text-[#00E676] hover:text-white underline font-mono"
            >
              SYNC_COORDS
            </button>
          </div>
        ) : locationError ? (
          <div className="bg-[#FF1744]/10 border border-[#FF1744]/30 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <div className="font-bold text-[#FF1744] text-sm uppercase">⚠️ GPS Signal Lost</div>
              <div className="text-xs text-[#FF1744]/70">{locationError}</div>
            </div>
            <button
              onClick={requestLocation}
              className="px-4 py-2 bg-[#FF1744]/20 border border-[#FF1744]/50 text-[#FF1744] hover:bg-[#FF1744] hover:text-white rounded transition text-xs font-bold uppercase"
            >
              Retry Connection
            </button>
          </div>
        ) : null}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
             { icon: '📋', label: 'Assigned', val: taskStats.assigned, color: 'text-blue-400', border: 'border-blue-500/30' },
             { icon: '⚙️', label: 'In Progress', val: taskStats.inProgress, color: 'text-purple-400', border: 'border-purple-500/30' },
             { icon: '⏳', label: 'Reviewing', val: taskStats.awaiting, color: 'text-yellow-400', border: 'border-yellow-500/30' },
             { icon: '✓', label: 'Verified', val: taskStats.verified, color: 'text-[#00E676]', border: 'border-[#00E676]/30' }
          ].map((stat, i) => (
             <div key={i} className={`bg-[#0B1220] p-4 rounded-xl border ${stat.border}`}>
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-xs text-[#94A3B8] uppercase tracking-wider">{stat.label}</div>
                <div className={`text-2xl font-black ${stat.color} font-mono mt-1`}>{stat.val}</div>
             </div>
          ))}
        </div>

        {/* Tasks Section */}
        {!workerId ? (
          <div className="bg-[#1F2937]/50 border border-yellow-500/30 rounded-xl p-8 text-center backdrop-blur-sm">
            <p className="text-yellow-400 font-bold mb-2">⚠️ UNAUTHORIZED UNIT</p>
            <p className="text-sm text-[#94A3B8]">Worker profile not linked. Contact Command Center.</p>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E676] mx-auto mb-4"></div>
            <p className="text-[#00E676] font-mono animate-pulse">DOWNLOADING MISSION DATA...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-[#0B1220] rounded-xl border border-[#1F2937] p-12 text-center">
            <div className="text-6xl mb-6 opacity-20">📡</div>
            <h3 className="text-xl font-bold text-white mb-2">No Active Missions</h3>
            <p className="text-[#94A3B8]">Standby for new assignments from Command Center.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-[#00E676] rounded-full"></span>
              MISSION LOG 
              <span className="text-xs text-[#94A3B8] font-mono ml-2 py-1 px-2 bg-[#1F2937] rounded-full">{tasks.length} ACTIVE</span>
            </h2>
            {tasks.map((task) => (
              <WorkerTaskCard
                key={task.id}
                task={task}
                workerLocation={workerLocation}
                onRefresh={fetchWorkerTasks}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
