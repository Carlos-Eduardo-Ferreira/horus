'use client';

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import clsx from 'clsx';
import { disableTooltipsTemporarily } from '@/components/Tooltip';

type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  buttons: React.ReactNode;
  size: ModalSize;
}

const sizeClasses = {
  xs: 'max-w-xl',
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-full',
};

export function Modal({
  show,
  onClose,
  icon,
  title,
  children,
  buttons,
  size,
}: ModalProps) {
  // Remove o foco quando o modal é fechado
  useEffect(() => {
    if (!show) {
      // Desabilita tooltips temporariamente
      disableTooltipsTemporarily();

      // Remove o foco de qualquer elemento
      const timeoutId = setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [show]);

  return (
    <Transition
      appear
      show={show}
      as={Dialog}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4 py-6"
      onClose={onClose}
    >
      <TransitionChild
        as="div"
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute inset-0 bg-gray-900/50 transition-opacity dark:bg-black/40" />
      </TransitionChild>

      <TransitionChild
        as={DialogPanel}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95 translate-y-2"
        enterTo="opacity-100 scale-100 translate-y-0"
        leave="ease-in duration-300"
        leaveFrom="opacity-100 scale-100 translate-y-0"
        leaveTo="opacity-0 scale-95 translate-y-2"
        className={clsx(
          'scrollbar-sm relative w-full flex flex-col overflow-y-auto rounded-lg bg-white px-4 py-6 duration-300 dark:bg-dark-700 sm:px-5',
          sizeClasses[size]
        )}
      >
        <div className="flex items-center justify-center mb-5">
          {icon}
          <div className="text-lg font-semibold text-gray-900 text-center">
            {title}
          </div>
        </div>

        <div className="flex-1">{children}</div>

        <div className="mt-6">{buttons}</div>
      </TransitionChild>
    </Transition>
  );
}
