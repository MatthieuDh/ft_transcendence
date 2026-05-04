import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { notificationService, authService } from '../api/services';
import type { Notification, User } from '../../../../shared/srcs/types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const profileRes = await authService.getProfile();
        setCurrentUser(profileRes.data);
        
        const notifsRes = await notificationService.getNotifications(profileRes.data.id);
        setNotifications(notifsRes.data);

        const token = localStorage.getItem('access_token');
        if (token) {
          socketRef.current = io('/', { auth: { token }, path: '/socket.io' });
          
          socketRef.current.on('connect', () => {
            socketRef.current?.emit('identify', profileRes.data.id);
          });
          
          socketRef.current.on('new_notification', (data: Notification) => {
            setNotifications(prev => [data, ...prev]);
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    init();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

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