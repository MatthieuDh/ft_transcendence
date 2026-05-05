import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Message } from '../../../../shared/srcs/types/message';
import { projectService } from '../api/services';

export function useChat(projectId: number, currentUserId: number, isOpen: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await projectService.getMessages(projectId);
        setMessages(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHistory();

    const token = localStorage.getItem('access_token');
    socketRef.current = io('/', { auth: { token }, path: '/socket.io' });

    socketRef.current.on('connect', () => {
      socketRef.current?.emit('identify', currentUserId);
      socketRef.current?.emit('joined project', { username: `User_${currentUserId}`, projectId });
    });

    socketRef.current.on('new_project_notification', (data: Message & { projectId: number }) => {
      if (data.projectId === projectId) {
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === data.id)) return prev;
          return [...prev, data];
        });
        
        if (data.userId !== currentUserId && !isOpenRef.current) {
          setUnreadCount((prev) => prev + 1);
        }
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('left project', { username: `User_${currentUserId}`, projectId });
        socketRef.current.disconnect();
      }
    };
  }, [projectId, currentUserId]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isSending) return false;
    setIsSending(true);
    try {
      const response = await projectService.createMessage(projectId, content);
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === response.data.id)) return prev;
        return [...prev, response.data];
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return { messages, sendMessage, isSending, unreadCount };
}