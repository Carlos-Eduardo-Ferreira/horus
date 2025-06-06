"use client";

import { createContext, ReactNode, useState, useCallback } from "react";

export type NotificationToastVariant = 'primary' | 'danger' | 'warning' | 'success';

export interface NotificationToast {
  id: string;
  message: string;
  variant: NotificationToastVariant;
  duration?: number;
  autoClose?: boolean;
}

interface NotificationToastContextProps {
  notifications: NotificationToast[];
  addNotification: (notification: Omit<NotificationToast, 'id'>) => void;
  removeNotification: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const NotificationToastContext = createContext<NotificationToastContextProps>({} as NotificationToastContextProps);

interface NotificationToastProviderProps {
  children: ReactNode;
}

export function NotificationToastProvider({ children }: NotificationToastProviderProps) {
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationToast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newNotification: NotificationToast = {
      id,
      autoClose: true,
      duration: notification.duration ?? 3000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const success = useCallback((message: string, duration: number = 3000) => {
    addNotification({ message, variant: 'success', duration });
  }, [addNotification]);

  const error = useCallback((message: string, duration: number = 3000) => {
    addNotification({ message, variant: 'danger', duration });
  }, [addNotification]);

  const warning = useCallback((message: string, duration: number = 3000) => {
    addNotification({ message, variant: 'warning', duration });
  }, [addNotification]);

  const info = useCallback((message: string, duration: number = 3000) => {
    addNotification({ message, variant: 'primary', duration });
  }, [addNotification]);

  return (
    <NotificationToastContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
    </NotificationToastContext.Provider>
  );
}

export { NotificationToastContext };
