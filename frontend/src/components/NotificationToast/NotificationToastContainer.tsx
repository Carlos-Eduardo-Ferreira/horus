import React from 'react';
import { useNotificationToast } from '@/hooks/useNotificationToast';
import NotificationToastItem from './NotificationToastItem';

export default function NotificationToastContainer() {
  const { notifications, removeNotification } = useNotificationToast();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-8 right-8 z-50 space-y-2">
      {notifications.map(notification => (
        <NotificationToastItem
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
}
