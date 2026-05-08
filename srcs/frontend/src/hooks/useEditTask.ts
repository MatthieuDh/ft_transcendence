import { useState, useEffect } from 'react';
import { taskService } from '../api/services';
import type { Task } from '../../../../shared/srcs/types';

export function useEditTask(task: Task | null, onTaskUpdate: () => void) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState('');

  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [editDeadline, setEditDeadline] = useState('');

  useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDesc(task.description || '');
      setEditDeadline(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '');
    }
  }, [task]);
  
  const handleUpdate = async (field: 'title' | 'description' | 'deadline') => {
    if (!task)
        return;
    const data: any = {};
    if (field === 'title')
    {
        if (!editTitle.trim())
            return;
        data.tile = editTitle;
    }
    if (field === 'description') 
        data.description = editDesc;
    if (field === 'deadline') 
    {
      data.deadline = editDeadline ? new Date(editDeadline).toISOString() : null;
    }
    try {
      await taskService.update(task.id, data);
      onTaskUpdate();
      setIsEditingTitle(false);
      setIsEditingDesc(false);
      setIsEditingDeadline(false);
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const cancelEdit = (field: 'title' | 'description' | 'deadline') => {
    if (!task) return;
    if (field === 'title') {
      setIsEditingTitle(false);
      setEditTitle(task.title);
    }
    if (field === 'description') {
      setIsEditingDesc(false);
      setEditDesc(task.description || '');
    }
    if (field === 'deadline') {
      setIsEditingDeadline(false);
      setEditDeadline(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '');
    }
  };

  return {
    isEditingTitle, setIsEditingTitle, editTitle, setEditTitle,
    isEditingDesc, setIsEditingDesc, editDesc, setEditDesc,
    isEditingDeadline, setIsEditingDeadline, editDeadline, setEditDeadline,
    handleUpdate, cancelEdit
  };
}