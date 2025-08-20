'use client';

import { Avatar, AvatarFallback } from '@/components/shared/avatar';
import Popover from '@/components/shared/popover';
import { useAuth } from '@/lib/auth/auth-context';
import { cn } from '@/lib/utils';
import { ChevronRight, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardTopBarProps {
  breadcrumbs: BreadcrumbItem[];
}

// Generate a color based on user identifier
function getAvatarColor(identifier: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-emerald-500',
  ];

  // Simple hash function to get consistent color for same identifier
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return colors[Math.abs(hash) % colors.length];
}

// Get initials from user name or identifier
function getInitials(name?: string, identifier?: string): string {
  if (name) {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  if (identifier) {
    return identifier.slice(0, 2).toUpperCase();
  }

  return 'U';
}

export default function DashboardTopBar({ breadcrumbs }: DashboardTopBarProps) {
  const { authedSession, logout } = useAuth();
  const [openPopover, setOpenPopover] = useState(false);

  const avatarColor = authedSession?.user.identifier
    ? getAvatarColor(authedSession.user.identifier)
    : 'bg-gray-500';

  const initials = getInitials(
    authedSession?.user.name,
    authedSession?.user.identifier
  );

  const handleLogout = () => {
    logout();
    setOpenPopover(false);
  };

  return (
    <div className="fixed top-0 z-40 w-full bg-white/10 backdrop-blur-xl border-b border-white/10">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-screen-xl mx-auto">
        {/* Left side - Breadcrumb navigation */}
        <div className="flex items-center space-x-2">
          {/* Safehill Logo */}
          <Link href="/authed" className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
          </Link>

          {/* Breadcrumb separator */}
          <ChevronRight className="h-4 w-4 text-gray-400" />

          {/* Breadcrumb items */}
          <nav className="flex items-center space-x-2">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-white">
                    {item.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-white/60" />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right side - User avatar and menu */}
        <div className="flex items-center space-x-4">
          <Popover
            content={
              <div className="w-full p-4">
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-900">
                    {authedSession?.user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {authedSession?.user.identifier}
                  </p>
                </div>
                <div className="border-t border-gray-200 mb-2" />
                <button
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </div>
            }
            openPopover={openPopover}
            setOpenPopover={setOpenPopover}
            align="end"
          >
            <button
              className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100 transition-colors"
              onClick={() => setOpenPopover(!openPopover)}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className={cn(avatarColor, 'text-white font-medium text-sm')}>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </Popover>
        </div>
      </div>
    </div>
  );
}
