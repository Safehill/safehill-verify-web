'use client';

import Popover from '@/components/shared/popover';
import { useAuth } from '@/lib/auth/auth-context';
import {
  usePayoutAccountStatus,
  usePayoutBalance,
} from '@/lib/hooks/use-payouts';
import { useCollections } from '@/lib/hooks/use-collections';
import type { CollectionOutputDTO } from '@/lib/api/models/dto/Collection';
import { getAvatarColorValue, getInitials } from '@/lib/utils';
import { isPayoutRequirementsDisabled } from '@/lib/utils/feature-flags';
import {
  ChevronRight,
  ChevronDown,
  LogOut,
  Wallet,
  Box,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AuthedSectionTopBarProps {
  breadcrumbs: BreadcrumbItem[];
}

export default function AuthedSectionTopBar({
  breadcrumbs,
}: AuthedSectionTopBarProps) {
  const { authedSession, logout } = useAuth();
  const pathname = usePathname();
  const currentUserId = authedSession?.user.identifier;
  const [openPopover, setOpenPopover] = useState(false);
  const [openSectionPopover, setOpenSectionPopover] = useState(false);

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

  // Determine current section
  const isPayoutsSection = pathname?.startsWith('/authed/payouts');
  const isCollectionsSection = !isPayoutsSection;

  // Check payout status and collections for warning banner
  const { data: payoutStatus, isLoading: isLoadingPayoutStatus } =
    usePayoutAccountStatus();
  const { data: collections = [] } = useCollections();

  // Get balance for earnings display
  const { data: balance } = usePayoutBalance({
    enabled: !!payoutStatus?.hasAccount && payoutStatus?.status === 'active',
  });

  // Format currency for earnings display
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    // Format for compact display with "k" for thousands (e.g., "$13.4k")
    if (amount >= 1000) {
      const thousands = amount / 1000;
      return `$${thousands.toFixed(1)}k`;
    }
    // For amounts under $1000, show full value (e.g., "$17.47")
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Check if user owns any collections
  const ownsCollections = collections.some(
    (collection: CollectionOutputDTO) => collection.createdBy === currentUserId
  );

  // Show warning if user owns collections but hasn't set up payouts
  // Skip if payout requirements are disabled via feature flag
  // Don't show banner while loading (prevents flash of banner on page load)
  const shouldShowPayoutWarning =
    !isPayoutRequirementsDisabled() &&
    !isLoadingPayoutStatus &&
    ownsCollections &&
    payoutStatus &&
    (!payoutStatus.hasAccount ||
      payoutStatus.status !== 'active' ||
      !payoutStatus.chargesEnabled ||
      !payoutStatus.payoutsEnabled);

  // Get the section icon and name
  const currentSection = isPayoutsSection
    ? { icon: Wallet, name: 'Payouts' }
    : { icon: Box, name: 'Collections' };
  const SectionIcon = currentSection.icon;

  return (
    <div className="fixed top-0 z-40 w-full">
      {/* Main header bar */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-screen-xl mx-auto">
          {/* Left side - Breadcrumb navigation */}
          <div className="flex items-center space-x-2">
            {/* Section Switcher Button */}
            <Popover
              content={
                <div className="w-full sm:w-[170px] p-2">
                  <Link
                    href="/authed"
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      isCollectionsSection
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setOpenSectionPopover(false)}
                  >
                    <Box className="mr-2 h-4 w-4 stroke-[3]" />
                    Collections
                  </Link>
                  <Link
                    href="/authed/payouts"
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      isPayoutsSection
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setOpenSectionPopover(false)}
                  >
                    <Wallet className="mr-2 h-4 w-4 stroke-[3]" />
                    Payouts
                  </Link>
                </div>
              }
              openPopover={openSectionPopover}
              setOpenPopover={setOpenSectionPopover}
              align="start"
            >
              {/*<button className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-orange-300 to-pink-100 hover:from-orange-400 hover:to-pink-200 transition-all duration-200 cursor-pointer w-[170px]">*/}
              <button className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-orange-100/20 border-orange-300 border-2 transition-all duration-200 cursor-pointer w-[170px]">
                <div className="flex items-center gap-3">
                  <SectionIcon className="h-6 w-6 text-orange-300" />
                  <span className="text-base font-semibold text-orange-300">
                    {currentSection.name}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-orange-300" />
              </button>
            </Popover>

            {/* Breadcrumb separator - only show if there are sub-breadcrumbs */}
            {breadcrumbs.length > 1 && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}

            {/* Sub-breadcrumb items (skip first item as it's now the button) */}
            <nav className="flex items-center space-x-2">
              {breadcrumbs.slice(1).map((item, index) => (
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
                  {index < breadcrumbs.slice(1).length - 1 && (
                    <ChevronRight className="h-4 w-4 text-white/60" />
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right side - Earnings and User avatar */}
          <div className="flex items-center space-x-4">
            {/* Earnings Display - Always show */}
            <div className="hidden sm:flex items-center text-white/90 text-sm">
              <span className="font-extralight">Total earnings</span>
              <Link href="/authed/payouts">
                <span className="ml-1 font-black underline">
                  {balance
                    ? formatCurrency(balance.totalEarnings, balance.currency)
                    : '$0.00'}
                </span>
              </Link>
            </div>

            <Popover
              content={
                <div className="w-full p-4">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-900">
                      {authedSession?.user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {authedSession?.user.phoneNumber}
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

      {/* Payout Warning Sub-header */}
      {shouldShowPayoutWarning && (
        <div className="bg-yellow-100 border-b border-yellow-300">
          <div className="flex items-center justify-between gap-3 px-4 md:px-8 max-w-screen-xl mx-auto py-3 h-12">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <AlertTriangle className="h-5 w-5 text-black flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-black font-medium text-sm">
                  Set up payouts to start selling collections
                </p>
              </div>
            </div>
            {!isPayoutsSection && (
              <Link
                href="/authed/payouts"
                className="bg-black text-yellow-100 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-black/90 transition-colors flex-shrink-0 whitespace-nowrap"
              >
                Set up now
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
