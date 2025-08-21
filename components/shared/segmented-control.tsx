'use client';

import { cn } from '@/lib/utils';

interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <div className={cn('flex rounded-lg bg-white/10 p-1', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
            value === option.value
              ? 'bg-white/20 text-white shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          )}
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
