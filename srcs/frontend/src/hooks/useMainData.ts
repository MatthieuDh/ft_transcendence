import { useState, useEffect } from 'react';
import { projectService, taskService } from '../api/services';
import type { Project, Task } from '../../../../shared/srcs/types';

export function useMainPageData() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [projRes, taskRes] = await Promise.all([
        projectService.getMyProjects(),
        taskService.getMyTasks()
      ]);
      setProjects(Array.isArray(projRes.data) ? projRes.data : (projRes.data as any).data || []);
      setMyTasks(Array.isArray(taskRes.data) ? taskRes.data : (taskRes.data as any).data || []);
    } catch (error) {
      console.error("Error fetching main page data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusWeight: Record<string, number> = {
    TODO: 1,
    IN_PROGRESS: 2,
    PENDING_EVALUATION: 3,
    DONE: 4,
  };

  const sortedTasks = [...myTasks].sort((a, b) => {
    const weightA = statusWeight[a.status] || 99;
    const weightB = statusWeight[b.status] || 99;
    if (weightA !== weightB) return weightA - weightB;
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return { projects, sortedTasks, isLoading, refresh: fetchData };
}