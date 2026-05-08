import { useState, useEffect, useCallback } from 'react';
import { projectService, taskService, authService } from '../api/services';
import type { Project, Task, TaskStatus, User, ProjectStatus } from '../../../../shared/srcs/types';
import { useSocket } from '../context/SocketContext';

export function useProjectDetails(projectId: number) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();

  const reloadProject = useCallback(async () => {
    try {
      const res = await projectService.getById(projectId);
      setProject(res.data);
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error(error);
    }
  }, [projectId]);

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
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  useEffect(() => {
    if (!socket || !projectId || !currentUser) return;

    socket.emit('joined project', { username: currentUser.username, projectId });

    socket.on('task_updated', (updatedTask: Task) => {
      setTasks(prevTasks =>
        prevTasks.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t)
      );
    });

    socket.on('task_created', (newTask: Task) => {
      setTasks(prev => {
        if (prev.some(t => t.id === newTask.id)) return prev;
        return [...prev, newTask];
      });
    });

    socket.on('task_deleted', (deletedTaskId: number) => {
      setTasks(prev => prev.filter(t => t.id !== deletedTaskId));
    });

    socket.on('project_updated', (updatedProject: Project) => {
      setProject(prev => prev ? { ...prev, ...updatedProject } : null);
    });

    socket.on('member_updated', () => {
      reloadProject();
    });

    return () => {
      socket.emit('left project', { username: currentUser.username, projectId });
      socket.off('task_updated');
      socket.off('task_created');
      socket.off('task_deleted');
      socket.off('project_updated');
      socket.off('member_updated');
    };
  }, [socket, projectId, currentUser, reloadProject]);

  const changeTaskStatus = async (taskId: number, newStatus: TaskStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    );

    try {
      await taskService.update(taskId, { status: newStatus });
    } catch (error) {
      console.error(error);
      reloadProject();
    }
  };

  const assignTaskMember = async (taskId: number, userIds: number[]) => {
    setTasks(prevTasks => 
      prevTasks.map(t => {
        if (t.id === taskId) {
          const newAssignees = project?.members
            ?.filter(m => userIds.includes(m.userId))
            .map(m => m.user) || [];
          return { ...t, assignees: newAssignees as any };
        }
        return t;
      })
    );

    try {
      await taskService.update(taskId, { assigneeIds: userIds });
    } catch (error) {
      console.error(error);
      reloadProject();
    }
  };

  const changeProjectStatus = async (newStatus: ProjectStatus) => {
    if (!project) return;
    
    setProject({ ...project, status: newStatus });

    try {
      await projectService.update(projectId, { status: newStatus });
    } catch (error) {
      console.error(error);
      reloadProject();
    }
  };

  const removeProjectMember = async (userId: number) => {
    try {
      await projectService.removeMember(projectId, userId);
      await reloadProject();
    } catch (error) {
      console.error(error);
    }
  };

  const removeTask = async (taskId: number) => {
    try {
      await taskService.delete(taskId);
      await reloadProject();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProject = async () => {
    try {
      await projectService.delete(projectId);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return { 
    project, tasks, currentUser, isLoading, reloadProject, 
    changeTaskStatus, changeProjectStatus, assignTaskMember, 
    removeProjectMember, removeTask, deleteProject 
  };
}