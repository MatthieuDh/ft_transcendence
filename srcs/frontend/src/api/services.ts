import client from './client';
import type { AuthToken, DashboardMetrics, Comment, Message, FriendRequest, FriendUser, Notification, Project, Task, User, TaskStatus, DashboardFilters } from '../../../../shared/srcs/types';

export const authService = {
    login: (username: string, password: string) =>
        client.post<AuthToken>('auth/login', {username, password}),
    googleLogin: () => {window.location.href = '${import.meta.env.VITE_API_BASE_URL}/auth/google';},
    refresh: () => client.post('auth/refresh'),
};

export const commentService = {
    create: (taskId: number, userId: number, data: { content: string; parentId?: number; files?: string[]}) =>
        client.post<Comment>(`tasks/${taskId}/comments`, { userId, ...data}),
    getByTaskId: (taskId: number) =>
        client.get<Comment[]>(`tasks/${taskId}/comments`),
};

export const taskService = {
  getAllAdmin: () => client.get<Task[]>('/tasks/all'),
  getMyTasks: () => client.get<Task[]>('/tasks/my'),
  getTaskById: (taskId: number) => client.get<Task>(`/tasks/${taskId}`),
  create: (data: { title: string; description?: string; projectId: number; status?: TaskStatus; deadline?: Date; assigneeIds: number[] }) =>
    client.post<Task>('/tasks', data),
  update: (taskId: number, data: { title?: string; status?: TaskStatus; assigneeIds?: number[] }) =>
    client.patch<Task>(`/tasks/${taskId}`, data),
  delete: (taskId: number) => client.delete<Task>(`/tasks/${taskId}`),
};

export const projectService = {
    create: (data: { name: string; description?: string; deadline?: string }, userId: number) =>
        client.post<Project>('/projects', {userId, ...data}),
    getAll: () => client.get<Project[]>('/projects'),
    getById: (projectId: number) =>
        client.get<Project>(`/projects/${projectId}`),
    update: (projectId: number, name?: string, description?: string, deadline?: string ) =>
        client.patch<Project>(`/projects/${projectId}`, {name, description, deadline}),
    delete: (projectId: number) =>
        client.delete<Project>(`/projects/${projectId}`),
    addMember: (projectId: number, userId: number, role:string) =>
        client.post<Project>(`/projects/${projectId}/members`, {userId, role}),
    createMessage: (projectId: number, content: string) =>
        client.post<Message>(`/projects/${projectId}/messages`, {content}),
    getMessages: (projectId: number) =>
        client.get<Message[]>(`/projects/${projectId}/messages`),
};

export const friendService = {
  getMyFriends: () => client.get<FriendUser[]>('/friends'),
  getRequests: () => client.get<FriendRequest[]>('/friends/requests'),
  sendRequest: (addressee: number) => client.post<FriendRequest>(`/friends/requests/${addressee}`),
  acceptRequest: (requesterId: number) => client.patch<FriendRequest>(`/friends/accept/${requesterId}`),
  rejectRequest: (requesterId: number) => client.patch<FriendRequest>(`/friends/reject/${requesterId}`),
  removeFriend: (friendshipId: number) => client.delete<void>(`/friends/remove/${friendshipId}`),
};

export const notificationService = {
    create: (userId: number, type: string, message: string) =>
        client.post<Notification>('/notifications', {userId, type, message}),
    getNotifications: (userId: number) => client.get<Notification[]>(`/notification/user/${userId}`),
    markAsRead: (userId: number) => client.patch<Notification>(`/notifications/user/${userId}/read`),
};

export const dashboardMetrics = {
    getGlobalMetrics: (filters: DashboardFilters) =>
        client.get<DashboardMetrics>('/dashboard', {params: filters}),
    getProjectMetrics: (projectId: number, filters: DashboardFilters) => 
        client.get<DashboardMetrics>(`/dashboard/projects/${projectId}`, {params: filters}),
    exportMetrics: (filters: DashboardFilters, format: 'csv' | 'pdf') =>
        client.get('dashboard/export', {params: {...filters, format}, responseType: 'blob'}),
};

export const userService = {
    create: (data: {username: string; email: string; password: string; avatar?: string}) =>
        client.post<User>('/users', {data}),
    getAllUsers: () => client.get<User[]>('/users'),
    getUser: (userId: number) => client.get<User>(`/users/${userId}`),
    delete: (userId: number) => client.delete<User>(`/users/${userId}`),
    updateUser: (data: {username?: string; email?: string; password?: string; avatar?: string}) =>
        client.patch<User>('users/me', {data}),
    promoteUser: (username: string) => client.patch<User>(`/users/promote/${username}`),
    demoteUser: (username: string) => client.patch<User>(`/users/demote/${username}`),
};