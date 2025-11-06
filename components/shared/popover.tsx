'use client';

import useMediaQuery from '@/lib/hooks/use-media-query';
import * as Dialog from '@radix-ui/react-dialog';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

export default function Popover({
  children,
  content,
  align = 'center',
  openPopover,
  setOpenPopover,
  darkTheme = false,
}: {
  children: ReactNode;
  content: ReactNode | string;
  align?: 'center' | 'start' | 'end';
  openPopover: boolean;
  setOpenPopover: Dispatch<SetStateAction<boolean>>;
  mobileOnly?: boolean;
  darkTheme?: boolean;
}) {
  const { isMobile } = useMediaQuery();

  if (isMobile) {
    return (
      <Dialog.Root open={openPopover} onOpenChange={setOpenPopover}>
        <Dialog.Trigger asChild>
          <div className="sm:hidden">{children}</div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur" />
          <Dialog.Content
            className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-[10px] ${
              darkTheme
                ? 'bg-[#222] border-t border-[#333]'
                : 'bg-white border-t border-gray-200'
            }`}
          >
            <Dialog.Title className="absolute left-[-10000px]">
              Menu
            </Dialog.Title>
            <div
              className={`sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] ${
                darkTheme ? 'bg-[#222]' : 'bg-inherit'
              }`}
            >
              <div
                className={`my-3 h-1 w-12 rounded-full ${
                  darkTheme ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              />
            </div>
            <div
              className={`w-full pb-8 shadow-xl ${
                darkTheme ? 'bg-[#222]' : 'bg-white'
              }`}
            >
              {content}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <PopoverPrimitive.Root open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverPrimitive.Trigger className="hidden sm:inline-flex" asChild>
        {children}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          align={align}
          className={`z-50 animate-slide-up-fade items-center rounded-md drop-shadow-lg ${
            darkTheme
              ? 'border-2 border-[#333] bg-[#111]'
              : 'border border-gray-200 bg-white'
          }`}
        >
          {/* Disclosure triangle on the left */}
          {darkTheme && (
            <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-0 h-0 border-t-6 border-b-6 border-l-6 border-transparent border-l-[#111]"></div>
          )}
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
