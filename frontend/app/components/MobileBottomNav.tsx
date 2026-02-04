'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/citizen',
    icon: '🏠',
    activeIcon: '🏠',
  },
  {
    name: 'Report',
    href: '/citizen/report',
    icon: '📝',
    activeIcon: '📝',
  },
  {
    name: 'My Reports',
    href: '/citizen/my-reports',
    icon: '📊',
    activeIcon: '📊',
  },
  {
    name: 'Map',
    href: '/citizen/map',
    icon: '🗺️',
    activeIcon: '🗺️',
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/citizen' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg" role="img" aria-label={item.name}>
                {isActive ? item.activeIcon : item.icon}
              </span>
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}