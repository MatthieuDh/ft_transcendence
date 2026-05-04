import type { User } from './user';

export interface Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  user?: User;
}
