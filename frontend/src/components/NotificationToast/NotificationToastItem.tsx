import React, { useEffect, useState, useCallback } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import Text from '../Text';
import { cn } from '@/utils/classNames';
import { NotificationToast, NotificationToastVariant } from '@/context/notificationToast.context';

interface NotificationToastItemProps {
  notification: NotificationToast;
  onClose: (id: string) => void;
}

const variants: Record<NotificationToastVariant, { 
  border: string; 
  bg: string; 
  text: string; 
  icon: React.ComponentType<{ className?: string }>;
  progressBg: string;
}> = {
  primary: {
    border: 'border-indigo-400',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    icon: FaInfoCircle,
    progressBg: 'bg-indigo-400',
  },
  danger: {
    border: 'border-red-400',
    bg: 'bg-red-50',
    text: 'text-red-600',
    icon: FaTimes,
    progressBg: 'bg-red-400',
  },
  warning: {
    border: 'border-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    icon: FaExclamationTriangle,
    progressBg: 'bg-amber-400',
  },
  success: {
    border: 'border-green-400',
    bg: 'bg-green-50',
    text: 'text-green-600',
    icon: FaCheckCircle,
    progressBg: 'bg-green-400',
  },
};

export default function NotificationToastItem({ notification, onClose }: NotificationToastItemProps) {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const colors = variants[notification.variant];
  const Icon = colors.icon;

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  }, [onClose, notification.id]);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    let autoCloseTimer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (notification.autoClose && notification.duration) {
      autoCloseTimer = setTimeout(() => {
        handleClose();
      }, notification.duration);

      const updateInterval = 50;
      const totalSteps = notification.duration / updateInterval;
      const progressDecrement = 100 / totalSteps;

      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - progressDecrement;
          if (newProgress <= 0) {
            clearInterval(progressInterval);
            return 0;
          }
          return newProgress;
        });
      }, updateInterval);
    }

    return () => {
      clearTimeout(showTimer);
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [notification.autoClose, notification.duration, notification.id, handleClose]);

  return (
    <div
      className={cn(
        'relative overflow-hidden transform transition-all duration-300 ease-in-out mb-3',
        'shadow-lg rounded-lg border-l-4 max-w-sm w-full',
        colors.border,
        colors.bg,
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      {/* Conteúdo principal */}
      <div className="flex items-start p-4">
        <Icon className={cn('shrink-0 w-5 h-5 mt-0.5', colors.text)} />
        
        <div className="ml-3 flex-1">
          <Text size="sm" className={cn('font-medium', colors.text)} noDefaultColor>
            {notification.message}
          </Text>
        </div>
        
        <button
          onClick={handleClose}
          className={cn(
            'ml-3 shrink-0 p-1 rounded-md transition-colors cursor-pointer',
            'hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2',
            colors.text
          )}
        >
          <AiOutlineClose className="w-4 h-4" />
        </button>
      </div>
      
      {/* Barra de progresso */}
      {notification.autoClose && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10">
          <div
            className={cn('h-full transition-all duration-75 ease-linear', colors.progressBg)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
