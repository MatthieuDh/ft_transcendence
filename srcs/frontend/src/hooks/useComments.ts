import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { commentService } from '../api/services';
import type { Comment } from '../../../../shared/srcs/types';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export function useComments(taskId: number | undefined, projectId: number | undefined, isOpen: boolean) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const fetchComments = useCallback(async () => {
    if (!taskId) return;
    setIsLoading(true);
    try {
      const res = await commentService.getByTaskId(taskId);
      setComments(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (isOpen && taskId && projectId) {
      fetchComments();

      const token = localStorage.getItem('access_token');
      if (token) {
        socketRef.current = io(SOCKET_URL, { auth: { token }, path: '/socket.io' });

        socketRef.current.on('connect', () => {
          socketRef.current?.emit('joined project', { username: 'viewer', projectId });
        });

        socketRef.current.on('new_task_comment', (newComment: Comment) => {
          if (newComment.taskId === taskId) {
            setComments(prev => {
              if (prev.some(c => c.id === newComment.id)) return prev;
              return [...prev, newComment];
            });
          }
        });
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('left project', { username: 'viewer', projectId });
        socketRef.current.disconnect();
      }
    };
  }, [taskId, projectId, isOpen, fetchComments]);

  const postComment = async (content: string, file: File | null) => {
    if (!taskId || !content.trim()) return false;
    setIsSubmitting(true);
    try {
      await commentService.create(taskId, {
        content,
        files: file ? [file] : undefined,
      });
      await fetchComments();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { comments, isLoading, isSubmitting, postComment };
}
