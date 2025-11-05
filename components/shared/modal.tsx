'use client';

import useMediaQuery from '@/lib/hooks/use-media-query';
import { cn } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import type { Dispatch, SetStateAction } from 'react';
import { Drawer } from 'vaul';

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  title?: string;
  description?: string;
}

const Modal = ({
  children,
  className,
  showModal,
  setShowModal,
  title,
  description,
}: ModalProps) => {
  const { isMobile } = useMediaQuery();

  if (isMobile) {
    return (
      <Drawer.Root open={showModal} onOpenChange={setShowModal}>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-gray-100 bg-opacity-10 backdrop-blur" />
        <Drawer.Portal>
          <Drawer.Content
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t border-gray-200 bg-white max-h-[95vh] flex flex-col',
              className
            )}
          >
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit flex-shrink-0">
              <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
            </div>
            <Drawer.Title className="absolute left-[-10000px]">
              {title || 'Modal'}
            </Drawer.Title>
            <Drawer.Description className="absolute left-[-10000px]">
              {description || 'Modal content'}
            </Drawer.Description>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog.Root open={showModal} onOpenChange={setShowModal}>
      <Dialog.Portal>
        <Dialog.Overlay
          // for detecting when there's an active opened modal
          id="modal-backdrop"
          className="animate-fade-in fixed inset-0 z-40 bg-gray-100 bg-opacity-50 backdrop-blur-md"
        />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            'animate-scale-in fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-200 bg-white p-0 shadow-xl rounded-2xl',
            className
          )}
        >
          <Dialog.Title className="absolute left-[-10000px]">
            {title || 'Modal'}
          </Dialog.Title>
          <Dialog.Description className="absolute left-[-10000px]">
            {description || 'Modal content'}
          </Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
