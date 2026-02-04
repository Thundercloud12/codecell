'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { InstallButton } from './InstallButton';
import { OfflineIndicator } from './OfflineIndicator';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/citizen',
    icon: '🏠',
    description: 'Overview',
  },
  {
    name: 'Report Pothole',
    href: '/citizen/report',
    icon: '📝',
    description: 'Submit new report',
  },
  {
    name: 'My Reports',
    href: '/citizen/my-reports',
    icon: '📊',
    description: 'View submissions',
  },
  {
    name: 'Map View',
    href: '/citizen/map',
    icon: '🗺️',
    description: 'See all potholes',
  },
];

interface TabletLayoutProps {
  children: React.ReactNode;
}

export function TabletLayout({ children }: TabletLayoutProps) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="hidden md:flex lg:hidden min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">Citizen Portal</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="mt-4">
            <OfflineIndicator />
          </div>
          <div className="mt-4">
            <InstallButton />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/citizen' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <span className="text-2xl" role="img" aria-label={item.name}>
                    {item.icon}
                  </span>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">
                Welcome, {user?.firstName}!
              </div>
              <div className="text-sm text-gray-500">
                Citizen Dashboard
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}