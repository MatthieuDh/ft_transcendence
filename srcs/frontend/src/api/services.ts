import client from './client';
import { type AuthToken, type DashboardMetrics, type Comment, type Message, type FriendRequest, type FriendUser, type Notification, type Project, type ProjectMember, type ProjectRole, type Task, type User, type PromotedUser, type TaskStatus, type DashboardFilters, type ProjectStatus, type SentRequest } from '../../../../shared/srcs/types';

export const authService = {
  login: async (username: string, password: string) => {
    const response = await client.post<AuthToken>('/auth/login', { username, password });
    localStorage.setItem('access_token', response.data.access_token);
    if (response.data.refresh_token)
      localStorage.setItem('refresh_token', response.data.refresh_token);
    return response;
  },
  googleLogin: () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}`;
  },
  refresh: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token');
    const response = await client.post<{ access_token: string }>('/auth/refresh', { refresh_token: refreshToken });
    localStorage.setItem('access_token', response.data.access_token);
    return response;
  },
  getProfile: () => client.get<User>('/auth/profile'),
  initialize: async () =>{
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return;
    try{
      const { data } = await client.post('/auth/refresh', {refresh_token: refreshToken},
        {withCredentials: true});
        localStorage.setItem('access_token', data.access_token);
    } catch{
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
};

export const commentService = {
  create: (taskId: number, data: { content: string; parentId?: number; files?: File[] }) => {
    const formData = new FormData();
    formData.append('content', data.content);
    if (data.parentId) formData.append('parentId', String(data.parentId));
    if (data.files) data.files.forEach(file => formData.append('files', file));
    return client.post<Comment>(`/tasks/${taskId}/comments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getByTaskId: (taskId: number) =>
    client.get<Comment[]>(`/tasks/${taskId}/comments`),
};

export const taskService = {
  getAllAdmin: () => client.get<Task[]>('/tasks/all'),
  getMyTasks: () => client.get<Task[]>('/tasks/my'),
  getTaskById: (taskId: number) => client.get<Task>(`/tasks/${taskId}`),
  create: (data: { title: string; description?: string; projectId: number; status?: TaskStatus; deadline?: Date; assigneeIds: number[] }) =>
    client.post<Task>('/tasks', data),
  update: (taskId: number, data: { title?: string; description?: string; status?: TaskStatus; deadline?: Date | string | null; assigneeIds?: number[] }) =>
    client.patch<Task>(`/tasks/${taskId}`, data),
  delete: (taskId: number) => client.delete<Task>(`/tasks/${taskId}`),
};

export const projectService = {
  create: (data: { name: string; description?: string; deadline?: string }) =>
    client.post<Project>('/projects', data),
  getAll: () => client.get<Project[]>('/projects'),
  getMyProjects: () => client.get<Project[]>('/projects/my'),
  getById: (projectId: number) => client.get<Project>(`/projects/${projectId}`),
  update: (projectId: number, data: { name?: string; description?: string; deadline?: string; status?: ProjectStatus }) =>
    client.patch<Project>(`/projects/${projectId}`, data),
  delete: (projectId: number) => client.delete<{ message: string }>(`/projects/${projectId}`),
  addMember: (projectId: number, userId: number, role: ProjectRole) =>
    client.post<ProjectMember>(`/projects/${projectId}/members`, { userId, role }),
  removeMember: (projectId: number, userId: number) =>
    client.delete<{ message: string }>(`/projects/${projectId}/members/${userId}`),
  createMessage: (projectId: number, content: string) =>
    client.post<Message>(`/projects/${projectId}/messages`, { content }),
  getMessages: (projectId: number) => client.get<Message[]>(`/projects/${projectId}/messages`),
};

export const friendService = {
  getMyFriends: () => client.get<FriendUser[]>('/friends'),
  getFriendsByUserId: (userId: number) => client.get<FriendUser[]>(`/friends/user/${userId}`),
  getRequests: () => client.get<FriendRequest[]>('/friends/requests'),
  sendRequest: (addressee: number) => client.post<FriendRequest>(`/friends/request/${addressee}`),
  getSentRequests: () => client.get<SentRequest[]>('/friends/sent-requests'),
  acceptRequest: (requesterId: number) => client.patch<FriendRequest>(`/friends/accept/${requesterId}`),
  rejectRequest: (requesterId: number) => client.patch<FriendRequest>(`/friends/reject/${requesterId}`),
  removeFriend: (friendshipId: number) => client.delete<void>(`/friends/remove/${friendshipId}`),
};

export const notificationService = {
  getNotifications: (userId: number) => client.get<Notification[]>(`/notifications/user/${userId}`),
  markAsRead: (userId: number) => client.patch<{ count: number}>(`/notifications/user/${userId}/read`),
};

export const dashboardMetrics = {
  getGlobalMetrics: (filters: DashboardFilters) =>
    client.get<DashboardMetrics>('/dashboard', {params: filters}),
  getProjectMetrics: (projectId: number, filters: DashboardFilters) => 
    client.get<DashboardMetrics>(`/dashboard/projects/${projectId}`, {params: filters}),
  exportMetrics: (filters: DashboardFilters, format: 'csv' | 'pdf') =>
    client.get('/dashboard/export', {params: {...filters, format}, responseType: 'blob'}),
};

export const userService = {
  create: (data: { username: string; email: string; password: string; avatar?: string }) =>
    client.post<User>('/users', data),
  getAllUsers: () => client.get<User[]>('/users'),
  getUser: (userId: number) => client.get<User>(`/users/${userId}`),
  getMe: () => client.get<User>('users/me'),
  delete: (userId: number) => client.delete<void>(`/users/${userId}`),
  updateUser: (data: { username?: string; email?: string; password?: string; avatar?: string }) =>
    client.patch<User>('/users/me', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    client.patch('/users/change-password', data),
  promoteUser: (userId: number) => client.patch<PromotedUser>(`/users/promote/${userId}`),
  demoteUser: (userId: number) => client.patch<PromotedUser>(`/users/demote/${userId}`),
};