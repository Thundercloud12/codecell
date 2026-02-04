'use client'

import { useEffect, useState } from 'react'

interface Worker {
  id: string
  name: string
  email: string
  employeeId: string
  phoneNumber: string | null
  currentLatitude: number | null
  currentLongitude: number | null
}

interface Pothole {
  id: string
  latitude: number
  longitude: number
  priorityLevel: string | null
  roadInfo: {
    roadName: string | null
  } | null
}

interface WorkerAssignmentModalProps {
  ticketId: string
  potholeId: string
  onClose: () => void
  onSuccess: () => void
}

export default function WorkerAssignmentModal({
  ticketId,
  potholeId,
  onClose,
  onSuccess
}: WorkerAssignmentModalProps) {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('')
  const [nearbyPotholes, setNearbyPotholes] = useState<Pothole[]>([])
  const [selectedPotholes, setSelectedPotholes] = useState<string[]>([potholeId])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWorkers()
    fetchNearbyPotholes()
  }, [])

  async function fetchWorkers() {
    try {
      const res = await fetch('/api/workers')
      const data = await res.json()
      if (data.success) {
        setWorkers(data.workers || [])
      }
    } catch (err) {
      console.error('Failed to fetch workers:', err)
      setError('Failed to load workers')
    } finally {
      setLoading(false)
    }
  }

  async function fetchNearbyPotholes() {
    try {
      const res = await fetch('/api/potholes?limit=50')
      const data = await res.json()
      if (data.success) {
        // Filter potholes without tickets
        const available = data.potholes.filter((p: Pothole & { ticket?: unknown }) => 
          !p.ticket && p.id !== potholeId
        )
        setNearbyPotholes(available)
      }
    } catch (err) {
      console.error('Failed to fetch nearby potholes:', err)
    }
  }

  async function handleAssign() {
    if (!selectedWorkerId) {
      setError('Please select a worker')
      return
    }

    setAssigning(true)
    setError('')

    try {
      // Assign worker to ticket
      const assignRes = await fetch(`/api/tickets/${ticketId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId: selectedWorkerId })
      })

      const assignData = await assignRes.json()
      if (!assignData.success) {
        throw new Error(assignData.error || 'Failed to assign worker')
      }

      // If additional potholes selected, create tickets for them
      const additionalPotholes = selectedPotholes.filter(id => id !== potholeId)
      if (additionalPotholes.length > 0) {
        for (const phId of additionalPotholes) {
          try {
            // Create ticket
            const ticketRes = await fetch('/api/tickets', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ potholeId: phId })
            })
            const ticketData = await ticketRes.json()
            
            if (ticketData.success) {
              // Assign to same worker
              await fetch(`/api/tickets/${ticketData.ticket.id}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workerId: selectedWorkerId })
              })
            }
          } catch (err) {
            console.error(`Failed to assign pothole ${phId}:`, err)
          }
        }
      }

      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to assign worker')
    } finally {
      setAssigning(false)
    }
  }

  function togglePothole(potholeId: string) {
    setSelectedPotholes(prev => 
      prev.includes(potholeId)
        ? prev.filter(id => id !== potholeId)
        : [...prev, potholeId]
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-[#0B1220] border border-[#1F2937] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1F2937] bg-[#050B16] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E676] to-[#00B8D4]"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-[#00E676]">👷</span> 
              <span className="tracking-wide">MISSION ASSIGNMENT</span>
            </h2>
            <p className="text-sm text-[#94A3B8] mt-1 font-mono">Select field operative & optimize route vectors</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-white text-3xl font-light w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#1F2937] transition"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-[#0B1220]">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded backdrop-blur-md">
              ⚠️ {error}
            </div>
          )}

          {/* Worker Selection */}
          <div>
            <label className="block text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">👤</span>
              <span>SELECT OPERATIVE</span>
              <span className="text-[#FF1744]">*</span>
            </label>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00E676] mx-auto mb-2"></div>
                <div className="text-[#00E676] font-mono animate-pulse">SEARCHING DATABASE...</div>
              </div>
            ) : workers.length === 0 ? (
              <div className="bg-[#1F2937] border border-yellow-500/30 rounded-lg p-4 text-center text-yellow-200">
                No active units found. Initialize worker profiles.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {workers.map(worker => (
                  <div
                    key={worker.id}
                    onClick={() => setSelectedWorkerId(worker.id)}
                    className={`border p-4 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                      selectedWorkerId === worker.id
                        ? 'border-[#00E676] bg-[#00E676]/10 shadow-[0_0_15px_rgba(0,230,118,0.2)]'
                        : 'border-[#1F2937] bg-[#050B16] hover:border-[#00B8D4] hover:shadow-[0_0_10px_rgba(0,184,212,0.1)]'
                    } rounded-xl`}
                  >
                    {selectedWorkerId === worker.id && <div className="absolute inset-0 border-2 border-[#00E676] rounded-xl animate-pulse opacity-50"></div>}
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-bold text-lg text-white group-hover:text-[#00B8D4] transition-colors">{worker.name}</div>
                        {selectedWorkerId === worker.id && (
                          <div className="bg-[#00E676] text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-[0_0_10px_#00E676]">
                            ✓
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-[#94A3B8] mb-1 font-mono">ID: {worker.employeeId}</div>
                      <div className="text-xs text-[#94A3B8] mb-3">{worker.email}</div>
                      
                      <div className="flex items-center justify-between">
                        {worker.currentLatitude ? (
                          <div className="flex items-center gap-2 text-[10px] text-[#00E676] bg-[#00E676]/10 px-2 py-1 rounded border border-[#00E676]/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse"></span>
                            TRACKING ACTIVE
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[10px] text-[#94A3B8] bg-[#1F2937] px-2 py-1 rounded">
                            OFFLINE
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Potholes - Route Optimization */}
          {nearbyPotholes.length > 0 && (
            <div className="border-t border-[#1F2937] pt-6">
              <div className="bg-gradient-to-r from-[#FFC400]/10 to-transparent border border-[#FFC400]/30 rounded-xl p-4 mb-4">
                <label className="block text-lg font-bold text-[#FFC400] mb-2 flex items-center gap-2">
                  <span className="text-2xl">🗺️</span>
                  <span>ROUTE OPTIMIZATION</span>
                </label>
                <div className="text-sm text-[#94A3B8] mb-2 font-light">
                  System detected proximate anomalies. Batch assignment recommended for efficiency.
                </div>
                <div className="flex items-center gap-2 text-xs text-[#FFC400] bg-[#FFC400]/10 px-3 py-2 rounded-lg w-fit border border-[#FFC400]/20">
                  <span>⚠️</span>
                  <span><strong>{nearbyPotholes.length}</strong> TARGETS IN SECTOR</span>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-3 p-2 bg-[#050B16]/50 rounded-xl border border-[#1F2937] custom-scrollbar">
                {nearbyPotholes.slice(0, 15).map(pothole => (
                  <div
                    key={pothole.id}
                    onClick={() => togglePothole(pothole.id)}
                    className={`border p-3 cursor-pointer transition-all ${
                      selectedPotholes.includes(pothole.id)
                        ? 'border-[#00E676] bg-[#00E676]/5 shadow-[inset_0_0_10px_rgba(0,230,118,0.1)]'
                        : 'border-[#1F2937] bg-[#0B1220] hover:border-[#00B8D4]'
                    } rounded-lg group`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                             selectedPotholes.includes(pothole.id) ? 'bg-[#00E676] border-[#00E676]' : 'border-[#94A3B8]'
                          }`}>
                            {selectedPotholes.includes(pothole.id) && <span className="text-black text-[10px] font-bold">✓</span>}
                          </div>
                          <div className="font-bold text-gray-200 group-hover:text-white">
                            {pothole.roadInfo?.roadName || 'Unknown Sector'}
                          </div>
                        </div>
                        <div className="text-xs text-[#94A3B8] ml-7 font-mono">
                          LAT: {pothole.latitude.toFixed(4)} | LNG: {pothole.longitude.toFixed(4)}
                        </div>
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        pothole.priorityLevel === 'CRITICAL'
                          ? 'bg-[#FF1744]/20 text-[#FF1744] border-[#FF1744]/50'
                          : pothole.priorityLevel === 'HIGH'
                          ? 'bg-[#FFC400]/20 text-[#FFC400] border-[#FFC400]/50'
                          : 'bg-[#00E676]/20 text-[#00E676] border-[#00E676]/50'
                      }`}>
                        {pothole.priorityLevel || 'NORMAL'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-[#00B8D4]">
                  <strong>TOTAL TARGETS:</strong> {selectedPotholes.length}
                </div>
              </div>
            </div>
          )}
        </div>
  
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#1F2937] bg-[#050B16]">
          <button
            onClick={onClose}
            className="px-6 py-3 text-[#94A3B8] hover:text-white transition font-mono text-sm hover:underline"
          >
            ABORT MISSION
          </button>
          
          <button
            onClick={handleAssign}
            disabled={assigning || !selectedWorkerId}
            className={`px-8 py-3 bg-gradient-to-r from-[#00E676] to-[#00B8D4] text-black font-black text-lg rounded-lg shadow-[0_0_20px_rgba(0,230,118,0.4)]
              hover:shadow-[0_0_30px_rgba(0,230,118,0.6)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {assigning ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                AUTHORIZING...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>⚡</span>
                <span>CONFIRM DEPLOYMENT</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
