'use client';

import { usePWA } from '../hooks/usePWA';

export function InstallButton() {
  const { isInstallable, isOffline, isInstalled, installPWA } = usePWA();

  // Don't show if already installed
  if (isInstalled) return null;

  const handleInstall = async () => {
    if (isInstallable) {
      // Use the standard PWA install prompt
      await installPWA();
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      // This will show browser-specific install instructions
      alert('To install this app:\n\n• Chrome: Click the install icon in the address bar\n• Firefox: Click the install button in the address bar\n• Safari: Click Share → Add to Home Screen\n• Edge: Click the install icon in the address bar');
    }
  };

  return (
    <button
      onClick={handleInstall}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-lg"
      disabled={isOffline}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      {isOffline ? 'Offline - Install Later' : 'Install App'}
    </button>
  );
}