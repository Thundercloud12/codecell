'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, HardHat, CheckCircle, Loader2, Activity, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const roles = [
  {
    id: 'CITIZEN',
    name: 'Citizen',
    icon: Users,
    description: 'Report potholes and track repairs in your area',
    gradient: 'from-[#22C55E] to-[#16A34A]',
    bgGlow: 'bg-[#22C55E]/20',
    borderColor: 'border-[#22C55E]',
    features: ['Submit reports', 'Track status', 'View map', 'Get notifications'],
  },
  {
    id: 'WORKER',
    name: 'Field Worker',
    icon: HardHat,
    description: 'Repair potholes and manage work assignments',
    gradient: 'from-[#F59E0B] to-[#D97706]',
    bgGlow: 'bg-[#F59E0B]/20',
    borderColor: 'border-[#F59E0B]',
    features: ['View assignments', 'Update location', 'Upload proof', 'Track tasks'],
  },
  {
    id: 'ADMIN',
    name: 'Administrator',
    icon: Shield,
    description: 'Manage system, workers, and approve repairs',
    gradient: 'from-[#8B5CF6] to-[#7C3AED]',
    bgGlow: 'bg-[#8B5CF6]/20',
    borderColor: 'border-[#8B5CF6]',
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
      <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#22C55E]" />
          <span className="text-[#9CA3AF] text-sm font-mono">INITIALIZING_SYSTEM...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0A0F1A] overflow-hidden font-sans text-[#E5E7EB] selection:bg-[#22C55E]/20">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#22C55E]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[30%] h-[30%] bg-[#8B5CF6]/10 rounded-full blur-[100px]" />
        <div className="absolute top-[50%] right-[-5%] w-[25%] h-[25%] bg-[#F59E0B]/10 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-8 z-20 flex items-center gap-4"
      >
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-medium text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </motion.div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 right-8 z-20"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#22C55E]/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-[#22C55E]/30">
            <Activity className="w-5 h-5 text-[#22C55E]" />
          </div>
          <span className="font-bold text-xl tracking-tight uppercase">
            Code<span className="text-[#22C55E]">Cell</span>
          </span>
        </div>
      </motion.div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <div className="max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141B2A] border border-[#22C55E]/30 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
              </span>
              <span className="text-xs font-semibold text-[#22C55E] tracking-wide uppercase">
                Account Setup
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight">
              Choose Your <span className="text-[#22C55E]">Role</span>
            </h1>
            <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
              Select how you&apos;d like to use the system. This determines your access level and dashboard.
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-center backdrop-blur-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {roles.map((role, index) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;

              return (
                <motion.button
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedRole(role.id)}
                  disabled={loading}
                  className={`relative bg-[#141B2A]/70 backdrop-blur-xl rounded-2xl p-6 text-left transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed border-2 ${
                    isSelected
                      ? `${role.borderColor} shadow-lg shadow-current/20`
                      : 'border-[#1F2937] hover:border-[#374151]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 bg-[#22C55E] text-black rounded-full p-2 shadow-lg shadow-[#22C55E]/30"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </motion.div>
                  )}

                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${role.bgGlow} border border-current/20`}>
                    <Icon className={`w-7 h-7 bg-gradient-to-br ${role.gradient} bg-clip-text`} style={{ 
                      color: role.id === 'CITIZEN' ? '#22C55E' : role.id === 'WORKER' ? '#F59E0B' : '#8B5CF6' 
                    }} />
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-[#E5E7EB]">{role.name}</h3>
                  <p className="text-[#9CA3AF] text-sm mb-4">{role.description}</p>

                  <div className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
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
              className="bg-[#22C55E] text-black px-12 py-4 rounded-xl font-semibold text-lg hover:bg-[#22C55E]/90 disabled:bg-[#1F2937] disabled:text-[#6B7280] disabled:cursor-not-allowed transition-all shadow-lg shadow-[#22C55E]/20 hover:shadow-xl hover:shadow-[#22C55E]/30 disabled:shadow-none flex items-center gap-3 mx-auto active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-mono">INITIALIZING_ACCOUNT...</span>
                </>
              ) : (
                <>
                  Continue with {selectedRole ? roles.find(r => r.id === selectedRole)?.name : 'Selected Role'}
                </>
              )}
            </button>

            <p className="mt-8 text-xs text-[#6B7280]">
              Protected by enterprise-grade encryption. <br />© 2024 CodeCell
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
