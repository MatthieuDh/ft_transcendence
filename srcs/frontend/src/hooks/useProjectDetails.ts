import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { projectService, taskService, authService } from '../api/services';
import type { Project, Task, TaskStatus, User, ProjectStatus } from '../../../../shared/srcs/types';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export function useProjectDetails(projectId: number) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [projectRes, profileRes] = await Promise.all([
          projectService.getById(projectId),
          authService.getProfile()
        ]);

        setProject(projectRes.data);
        setTasks(projectRes.data.tasks || []);
        setCurrentUser(profileRes.data);

        const token = localStorage.getItem('access_token');
        if (token) {
          socketRef.current = io(SOCKET_URL, { auth: { token }, path: '/socket.io' });

          socketRef.current.on('connect', () => {
            socketRef.current?.emit('identify', profileRes.data.id);
            socketRef.current?.emit('joined project', { username: profileRes.data.username, projectId });
          });

          socketRef.current.on('task_updated', (updatedTask: Task) => {
            setTasks(prevTasks =>
              prevTasks.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t)
            );
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [projectId]);

  const reloadProject = async () => {
    try {
      const res = await projectService.getById(projectId);
      setProject(res.data);
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error(error);
    }
  };

  const changeTaskStatus = async (taskId: number, newStatus: TaskStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    );
    try {
      await taskService.update(taskId, { status: newStatus });
    } catch (error) {
      console.error(error);
      const res = await projectService.getById(projectId);
      setTasks(res.data.tasks || []);
    }
  };

  const assignTaskMember = async (taskId: number, userIds: number[]) => {
    setTasks(prevTasks =>
      prevTasks.map(t => {
        if (t.id === taskId) {
          const newAssignees = project?.members
            ?.filter(m => userIds.includes(m.userId))
            .map(m => m.user) || [];
          return { ...t, assignees: newAssignees as unknown as User[] };
        }
        return t;
      })
    );
    try {
      await taskService.update(taskId, { assigneeIds: userIds });
    } catch (error) {
      console.error(error);
      const res = await projectService.getById(projectId);
      setTasks(res.data.tasks || []);
    }
  };

  const changeProjectStatus = async (newStatus: ProjectStatus) => {
    if (!project) return;
    setProject({ ...project, status: newStatus });
    try {
      await projectService.update(projectId, { status: newStatus });
    } catch (error) {
      console.error(error);
      const res = await projectService.getById(projectId);
      setProject(res.data);
    }
  };

  const removeProjectMember = async (userId: number) => {
    try {
      await projectService.removeMember(projectId, userId);
      await reloadProject();
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  };

  const removeTask = async (taskId: number) => {
    try {
      await taskService.delete(taskId);
      await reloadProject();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return { project, tasks, currentUser, isLoading, reloadProject, changeTaskStatus, changeProjectStatus, assignTaskMember, removeProjectMember, removeTask };
}
