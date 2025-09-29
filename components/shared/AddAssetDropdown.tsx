'use client';

import { Button } from '@/components/shared/button';
import Popover from '@/components/shared/popover';
import { Plus, ChevronDown, Upload, Copy } from 'lucide-react';
import { useState } from 'react';

interface AddAssetDropdownProps {
  onSelectUpload: () => void;
  onSelectFromCollection: () => void;
  className?: string;
}

export default function AddAssetDropdown({
  onSelectUpload,
  onSelectFromCollection,
  className = '',
}: AddAssetDropdownProps) {
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleUploadClick = () => {
    setOpenDropdown(false);
    onSelectUpload();
  };

  const handleFromCollectionClick = () => {
    setOpenDropdown(false);
    onSelectFromCollection();
  };

  return (
    <Popover
      content={
        <div className="w-full p-2">
          <div className="space-y-1">
            <button
              onClick={handleUploadClick}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Upload className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-medium text-sm">Upload Assets</div>
                <div className="text-xs text-gray-500">
                  Upload new images from your device
                </div>
              </div>
            </button>
            <button
              onClick={handleFromCollectionClick}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Copy className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium text-sm">From Other Collection</div>
                <div className="text-xs text-gray-500">
                  Copy assets from another collection
                </div>
              </div>
            </button>
          </div>
        </div>
      }
      openPopover={openDropdown}
      setOpenPopover={setOpenDropdown}
      align="end"
    >
      <Button
        className={`flex gap-2 px-4 py-2 bg-cyan-100/80 font-display text-black text-sm rounded-lg transform transition-all duration-100 hover:scale-100 hover:shadow-lg hover:bg-white/10 hover:border-teal-100 hover:border-2 hover:text-teal-100 ${
          openDropdown
            ? 'scale-100 shadow-lg bg-white/10 border-teal-100 border-2 text-teal-100'
            : ''
        } ${className}`}
        onClick={() => setOpenDropdown(!openDropdown)}
      >
        <Plus className="h-4 w-4" />
        <span>Add Assets</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
    </Popover>
  );
}
