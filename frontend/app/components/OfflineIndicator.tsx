'use client';

import { usePWA } from '../hooks/usePWA';

export function OfflineIndicator() {
  const { isOffline } = usePWA();

  if (!isOffline) return null;

  return (
    <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-2 sm:p-4">
      <div className="flex items-center">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <div className="min-w-0">
          <p className="font-bold text-sm">You're offline</p>
          <p className="text-xs opacity-90 hidden sm:block">
            Some features may be limited. Your reports will be saved locally and synced when you're back online.
          </p>
        </div>
      </div>
    </div>
  );
}