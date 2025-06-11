'use client';

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import clsx from 'clsx';
import { useRef, ReactNode, useEffect } from 'react';
import Button from '@/components/Button';
import { disableTooltipsTemporarily } from '@/components/Tooltip';

interface ConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onOk: () => void;
  confirmLoading?: boolean;
  className?: string;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
}

export function ConfirmModal({
  show,
  onClose,
  onOk,
  confirmLoading = false,
  className,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  icon,
}: ConfirmModalProps) {
  const focusRef = useRef<HTMLButtonElement>(null);

  const dialogProps = confirmLoading
    ? { onClose: () => {}, static: true }
    : { onClose };

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
      initialFocus={focusRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
      {...dialogProps}
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
          'scrollbar-sm relative w-full max-w-md flex flex-col overflow-y-auto rounded-lg bg-white px-4 py-6 text-center transition-all duration-300 dark:bg-dark-700 sm:px-5',
          className
        )}
      >
        <div className="mt-2">
          {title && (
            <h3 className="text-xl text-gray-800 dark:text-dark-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="mx-auto mt-2 max-w-xs">{description}</p>
          )}
          {icon && <div className="mt-6 flex justify-center">{icon}</div>}

          <div className="mt-8 flex justify-center space-x-3">
            <Button
              onClick={onClose}
              variant="light"
              className="h-9 min-w-[7rem]"
            >
              {cancelText}
            </Button>

            <Button
              ref={focusRef}
              onClick={onOk}
              variant="danger"
              disabled={confirmLoading}
              className="h-9 min-w-[7rem]"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </TransitionChild>
    </Transition>
  );
}