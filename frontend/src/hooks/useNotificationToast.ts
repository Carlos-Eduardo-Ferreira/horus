import { useContext } from 'react';
import { NotificationToastContext } from '@/context/notificationToast.context';

export function useNotificationToast() {
  const context = useContext(NotificationToastContext);
  
  if (!context) {
    throw new Error('useNotificationToast must be used within NotificationToastProvider');
  }
  
  return context;
}
