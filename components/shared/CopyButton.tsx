'use client';

import { Button } from '@/components/shared/button';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  onCopy?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'outline' | 'ghost';
  className?: string;
  tooltipText?: string;
  successText?: string;
}

export default function CopyButton({
  text,
  onCopy,
  disabled = false,
  size = 'sm',
  variant = 'outline',
  className = '',
  tooltipText = 'Copy this link',
  successText = 'Link copied to your clipboard',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = async () => {
    if (disabled) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowTooltip(true);
      onCopy?.();

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
        setShowTooltip(false);
      }, 2000);
    } catch (_error) {
      // console.error('Failed to copy text:', _error);
    }
  };

  const handleMouseEnter = () => {
    if (!disabled && !copied) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    if (!copied) {
      setShowTooltip(false);
    }
  };

  return (
    <div className="relative inline-block">
      <Button
        onClick={handleCopy}
        disabled={disabled}
        variant={variant}
        size={size}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
        }`}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-md shadow-lg whitespace-nowrap z-50">
          {copied ? successText : tooltipText}
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}
