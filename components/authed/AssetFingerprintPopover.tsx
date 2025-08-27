'use client';

import { Avatar, AvatarFallback } from '@/components/shared/avatar';
import Popover from '@/components/shared/popover';
import { getUserColor } from '@/lib/utils';
import { FingerprintIcon as LucideFingerprintIcon, User } from 'lucide-react';
import { useState } from 'react';

interface Asset {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded: string;
}

interface AssetFingerprintPopoverProps {
  asset: Asset;
  children?: React.ReactNode;
}

// Mock data for demonstration - in real app this would come from API
const mockOwnershipEvent = {
  owner: { name: 'You', identifier: 'current-user', icon: '😅' },
  date: 'Apr 20, 2025 at 9:27 PM',
};

const mockSharingEvents = [
  {
    date: 'Apr 20, 2025 at 10:16 PM',
    originator: { name: 'You', identifier: 'current-user', icon: '😅' },
    recipients: [
      { name: 'Giovanna Zelda', identifier: 'user-1', icon: '👩‍🦱' },
      { name: 'Bennie Veum', identifier: 'user-2', icon: '👨‍🦱' },
    ],
  },
  {
    date: 'Apr 21, 2025 at 2:30 PM',
    originator: { name: 'You', identifier: 'current-user', icon: '😅' },
    recipients: [{ name: 'Alex Johnson', identifier: 'user-3', icon: '👨‍💼' }],
  },
  {
    date: 'Apr 21, 2025 at 2:30 PM',
    originator: { name: 'You', identifier: 'current-user', icon: '😅' },
    recipients: [{ name: 'Alex Johnson', identifier: 'user-3', icon: '👨‍💼' }],
  },
  {
    date: 'Apr 21, 2025 at 2:30 PM',
    originator: { name: 'You', identifier: 'current-user', icon: '😅' },
    recipients: [{ name: 'Alex Johnson', identifier: 'user-3', icon: '👨‍💼' }],
  },
  {
    date: 'Apr 20, 2025 at 10:16 PM',
    originator: { name: 'You', identifier: 'current-user', icon: '😅' },
    recipients: [
      { name: 'Giovanna Zelda', identifier: 'user-1', icon: '👩‍🦱' },
      { name: 'Bennie Veum', identifier: 'user-2', icon: '👨‍🦱' },
    ],
  },
  {
    date: 'Apr 20, 2025 at 10:16 PM',
    originator: { name: 'You', identifier: 'current-user', icon: '😅' },
    recipients: [
      { name: 'Giovanna Zelda', identifier: 'user-1', icon: '👩‍🦱' },
      { name: 'Bennie Veum', identifier: 'user-2', icon: '👨‍🦱' },
    ],
  },
];

function AssetFingerprintRow({
  owner,
  date,
}: {
  owner: { name: string; identifier: string; icon: string };
  date?: string | null;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="rounded-full bg-purple-500/30 shadow-lg flex items-center justify-center h-8 w-8">
          <Avatar className="h-8 w-8">
            <AvatarFallback
              className={`${getUserColor(
                owner.identifier
              )} text-white text-2xl`}
            >
              {owner.icon}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="font-light text-white">{owner.name}</div>
        </div>
      </div>
      {date && <div className="text-xs text-gray-300/60">{date}</div>}
    </div>
  );
}

export default function AssetFingerprintPopover({
  children,
}: AssetFingerprintPopoverProps) {
  // Use internal state for uncontrolled popover
  const [open, setOpen] = useState(false);

  const popoverContent = (
    <div className="w-full sm:w-[25rem] overflow-y-auto text-white p-2 py-5 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 h-[min(800px,100vh-100px)]">
      {/* Owner section */}
      <div className="flex items-center space-x-2 px-6">
        <LucideFingerprintIcon size={18} />
        <div className="text-xs text-gray-400 font-light text-center">
          FINGERPRINTED BY
        </div>
      </div>
      <div className="m-2 bg-gray-500/30 rounded-lg px-3 py-2 mb-7">
        <AssetFingerprintRow
          owner={mockOwnershipEvent.owner}
          date={mockOwnershipEvent.date}
        />
      </div>

      {/* Sharing events */}
      <div className="px-2 space-y-4 mb-3">
        {mockSharingEvents.map((event, index) => (
          <div key={index} className="space-y-1">
            {/* Date */}
            <div className="text-xs text-gray-400 text-center mt-10">
              {event.date}
            </div>

            {/* Event card */}
            <div className="flex items-center justify-between px-4">
              <div className="text-xs text-gray-400 font-light text-center">
                SHARED BY
              </div>
              {/* Originator */}
              <AssetFingerprintRow owner={event.originator} />
            </div>
            <div className="bg-gray-500/30 rounded-lg">
              {/* Recipients */}
              <div className="flex items-center space-x-2 mb-2 bg-gray-500/30 rounded-t-lg p-2 px-4">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  with {event.recipients.length}{' '}
                  {event.recipients.length !== 1 ? 'people' : 'person'}
                </span>
              </div>

              {event.recipients.map((user, userIndex) => (
                <div
                  key={userIndex}
                  className="flex items-center space-x-3 mt-2 px-2 pb-2"
                >
                  <AssetFingerprintRow owner={user} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Popover
      openPopover={open}
      setOpenPopover={setOpen}
      content={popoverContent}
      align="end"
      darkTheme={true}
    >
      {children || <div />}
    </Popover>
  );
}
