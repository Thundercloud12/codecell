'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Task {
  id: string;
  ticketNumber: string;
  status: string;
  pothole: {
    latitude: number;
    longitude: number;
    priorityLevel: string;
    roadInfo: {
      roadName: string | null;
    } | null;
  };
}

export default function WorkerDashboard() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [workerId, setWorkerId] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkerTasks();
  }, []);

  async function fetchWorkerTasks() {
    try {
      // First get worker profile linked to this user
      const workerRes = await fetch('/api/workers');
      const workerData = await workerRes.json();
      
      if (workerData.success && workerData.workers.length > 0) {
        // Find worker by email (matches user email)
        const worker = workerData.workers.find((w: any) => w.email === user?.primaryEmailAddress?.emailAddress);
        
        if (worker) {
          setWorkerId(worker.id);
          
          // Fetch tasks for this worker
          const tasksRes = await fetch(`/api/workers/${worker.id}/tasks`);
          const tasksData = await tasksRes.json();
          
          if (tasksData.success) {
            setTasks(tasksData.tasks || []);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">Worker Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.firstName}!</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">My Work Dashboard</h2>
          <p className="text-gray-600">Manage your assigned repair tasks</p>
        </div>

        {!workerId ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 mb-2">Worker profile not found</p>
            <p className="text-sm text-yellow-700">Contact administrator to set up your worker profile</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Link href={`/workers/${workerId}`} className="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition">
                <div className="text-4xl mb-2">📍</div>
                <h3 className="text-xl font-bold mb-1">My Location</h3>
                <p className="text-sm opacity-90">Update your current location</p>
              </Link>

              <div className="bg-white p-6 rounded-lg border">
                <div className="text-4xl mb-2">🎫</div>
                <h3 className="text-xl font-bold mb-1">Assigned Tasks</h3>
                <p className="text-3xl font-bold text-orange-600">{tasks.filter(t => t.status === 'ASSIGNED').length}</p>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="text-4xl mb-2">⚙️</div>
                <h3 className="text-xl font-bold mb-1">In Progress</h3>
                <p className="text-3xl font-bold text-blue-600">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-bold mb-4">My Tasks</h3>
              {loading ? (
                <div className="text-gray-500">Loading...</div>
              ) : tasks.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No tasks assigned yet
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <Link 
                      key={task.id} 
                      href={`/tickets/${task.id}`}
                      className="border rounded p-4 flex justify-between items-center hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-mono font-bold">{task.ticketNumber}</div>
                        <div className="text-sm text-gray-600">
                          {task.pothole.roadInfo?.roadName || 'Unknown Road'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {task.pothole.latitude.toFixed(6)}, {task.pothole.longitude.toFixed(6)}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {task.status}
                        </span>
                        <div className="mt-1">
                          <span className={`px-2 py-1 rounded text-xs ${
                            task.pothole.priorityLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                            task.pothole.priorityLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.pothole.priorityLevel}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
