'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import LineSeparator from '@/components/home/LineSeparator';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  gradient?: string;
}

interface TabViewProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export default function TabView({ tabs, defaultTab, className }: TabViewProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile: Show all content consecutively */}
      <div className="block sm:hidden">
        {tabs.map((tab, index) => (
          <div key={tab.id}>
            <div className="py-20">
              {tab.content}
            </div>
            {index < tabs.length - 1 && (
              <div className="py-10">
                <LineSeparator />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: Tab Navigation */}
      <div className="hidden sm:flex justify-center items-center">
        <div className="flex flex-row w-full max-w-4xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 px-6 py-4 text-xl rounded-xl transition-all duration-200 whitespace-nowrap mx-2",
                activeTab === tab.id
                  ? "text-white shadow-lg transform scale-105 font-bold"
                  : "text-white/70 hover:text-white font-light"
              )}
              style={{
                background: activeTab === tab.id ? tab.gradient : 'transparent'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Tab Content */}
      <div className="hidden sm:block w-full pt-20">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "transition-all duration-300",
              activeTab === tab.id
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 absolute pointer-events-none"
            )}
          >
            {activeTab === tab.id && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
