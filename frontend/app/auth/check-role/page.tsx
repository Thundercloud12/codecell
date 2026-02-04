'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, HardHat, CheckCircle, Loader2 } from 'lucide-react';

const roles = [
  {
    id: 'CITIZEN',
    name: 'Citizen',
    icon: Users,
    description: 'Report potholes and track repairs in your area',
    color: 'blue',
    features: ['Submit reports', 'Track status', 'View map', 'Get notifications'],
  },
  {
    id: 'WORKER',
    name: 'Field Worker',
    icon: HardHat,
    description: 'Repair potholes and manage work assignments',
    color: 'orange',
    features: ['View assignments', 'Update location', 'Upload proof', 'Track tasks'],
  },
  {
    id: 'ADMIN',
    name: 'Administrator',
    icon: Shield,
    description: 'Manage system, workers, and approve repairs',
    color: 'purple',
    features: ['Full access', 'Manage workers', 'Review work', 'Analytics'],
  },
];

export default function CheckRolePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoaded && user) {
      // Check if user already has a role
      const existingRole = user.publicMetadata?.role as string;
      if (existingRole) {
        // Already has role, redirect to appropriate dashboard
        router.push(`/${existingRole.toLowerCase()}`);
      }
    }
  }, [isLoaded, user, router]);

  async function handleRoleSelection() {
    if (!selectedRole || !user) return;

    setLoading(true);
    setError('');

    try {
      // Update role in Clerk metadata and trigger database creation
      const response = await fetch('/api/auth/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          role: selectedRole,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Reload user to get updated metadata
        await user.reload();
        
        // Redirect to role-specific dashboard
        router.push(`/${selectedRole.toLowerCase()}`);
      } else {
        setError(data.error || 'Failed to set role');
      }
    } catch (err) {
      console.error('Error setting role:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-200 shadow-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-semibold text-gray-600">Welcome to Pothole Repair System</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Choose Your Role</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select how you'd like to use the system. You can change this later in settings.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const colorClasses = {
              blue: 'border-blue-500 bg-blue-50 shadow-blue-200',
              orange: 'border-orange-500 bg-orange-50 shadow-orange-200',
              purple: 'border-purple-500 bg-purple-50 shadow-purple-200',
            };

            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedRole(role.id)}
                disabled={loading}
                className={`relative bg-white rounded-2xl p-6 text-left transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? `border-2 ${colorClasses[role.color as keyof typeof colorClasses]} shadow-xl`
                    : 'border-2 border-gray-200 hover:border-gray-300 shadow-lg'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-2 shadow-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}

                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  role.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  role.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold mb-2">{role.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{role.description}</p>

                <div className="space-y-2">
                  {role.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={handleRoleSelection}
            disabled={!selectedRole || loading}
            className="bg-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-3 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Setting up your account...
              </>
            ) : (
              <>
                Continue with {selectedRole ? roles.find(r => r.id === selectedRole)?.name : 'Selected Role'}
              </>
            )}
          </button>

          <p className="mt-6 text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
