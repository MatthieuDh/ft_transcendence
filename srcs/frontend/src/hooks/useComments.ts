import { useState, useEffect, useCallback } from 'react';
import { commentService } from '../api/services';
import type { Comment } from '../../../../shared/srcs/types';
import { useSocket } from '../context/SocketContext';

export function useComments(taskId: number | undefined, projectId: number | undefined, isOpen: boolean) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const socket = useSocket();

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
    if (!isOpen || !taskId || !projectId) return;
    fetchComments();
  }, [isOpen, taskId, projectId, fetchComments]);

  useEffect(() => {
    if (!socket || !isOpen || !taskId || !projectId) return;

    socket.emit('joined project', { username: 'viewer', projectId });

    socket.on('new_task_comment', (newComment: Comment) => {
      if (newComment.taskId === taskId) {
        setComments(prev => {
          if (newComment.parentId) {
            return prev.map(c => {
              if (c.id === newComment.parentId) {
                const existingReplies = c.replies || [];
                if (existingReplies.some(r => r.id === newComment.id)) return c;
                return { ...c, replies: [...existingReplies, newComment] };
              }
              return c;
            });
          }
          if (prev.some(c => c.id === newComment.id)) return prev;
          return [...prev, newComment];
        });
      }
    });

    return () => {
      socket.emit('left project', { username: 'viewer', projectId });
      socket.off('new_task_comment');
    };
  }, [socket, isOpen, taskId, projectId]);

  const postComment = async (content: string, file: File | null, parentId?: number) => {
    if (!taskId || !content.trim()) return false;
    setIsSubmitting(true);
    try {
      await commentService.create(taskId, {
        content,
        parentId,
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