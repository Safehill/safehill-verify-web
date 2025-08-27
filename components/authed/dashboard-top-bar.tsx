'use client';

import Popover from '@/components/shared/popover';
import { useAuth } from '@/lib/auth/auth-context';
import { getAvatarColorValue } from '@/lib/utils';
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

// Get initials from user name or identifier
function getInitials(name?: string, identifier?: string): string {
  if (name) {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
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

  const avatarColorValue = authedSession?.user.identifier
    ? getAvatarColorValue(authedSession.user.identifier)
    : '#6b7280';

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
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-300 to-pink-100 flex items-center justify-center hover:scale-110 transition-all duration-300">
              <img
                src="/images/snoog-black.png"
                alt="Logo"
                className="w-[40px] object-cover object-top py-3 mx-2"
              />
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
            <div className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100 transition-colors cursor-pointer">
              <div 
                className="h-8 w-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                style={{ backgroundColor: avatarColorValue }}
              >
                {initials}
              </div>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
}
