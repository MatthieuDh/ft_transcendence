import { useState, useEffect, useRef } from 'react';
import type { Message } from '../../../../shared/srcs/types/message';
import { projectService } from '../api/services';
import { useSocket } from '../context/SocketContext';

export function useChat(projectId: number, currentUserId: number, isOpen: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useSocket();
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) setUnreadCount(0);
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
  }, [projectId]);

  useEffect(() => {
    if (!socket || !projectId || !currentUserId) return;

    socket.emit('joined project', { username: `User_${currentUserId}`, projectId });

    socket.on('new_project_notification', (data: Message & { projectId: number }) => {
      if (data.projectId === projectId) {
        setMessages(prev => {
          if (prev.some(msg => msg.id === data.id)) return prev;
          return [...prev, data];
        });
        if (data.userId !== currentUserId && !isOpenRef.current) {
          setUnreadCount(prev => prev + 1);
        }
      }
    });

    return () => {
      socket.emit('left project', { username: `User_${currentUserId}`, projectId });
      socket.off('new_project_notification');
    };
  }, [socket, projectId, currentUserId]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isSending) return false;
    setIsSending(true);
    try {
      const response = await projectService.createMessage(projectId, content);
      setMessages(prev => {
        if (prev.some(msg => msg.id === response.data.id)) return prev;
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