import { useState, useEffect } from 'react';
import { notificationService } from '../api/services';
import type { Notification } from '../../../../shared/srcs/types';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { currentUser } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    const init = async () => {
      if (!currentUser) return;
      try {
        const notifsRes = await notificationService.getNotifications(currentUser.id);
        setNotifications(notifsRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, [currentUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_notification', (data: Notification) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => {
      socket.off('new_notification');
    };
  }, [socket]);

  const markAllAsRead = async () => {
    if (!currentUser) return;
    try {
      await notificationService.markAsRead(currentUser.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  return { notifications, unreadCount, markAllAsRead };
}