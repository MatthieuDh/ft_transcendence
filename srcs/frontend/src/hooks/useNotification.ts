import { useState, useEffect } from 'react';
import { notificationService, authService } from '../api/services';
import type { Notification, User } from '../../../../shared/srcs/types';
import { useSocket } from '../context/SocketContext';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const socket = useSocket();

  useEffect(() => {
    const init = async () => {
      try {
        const profileRes = await authService.getProfile();
        setCurrentUser(profileRes.data);
        const notifsRes = await notificationService.getNotifications(profileRes.data.id);
        setNotifications(notifsRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

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
  return { notifications, unreadCount, markAllAsRead, currentUser };
}