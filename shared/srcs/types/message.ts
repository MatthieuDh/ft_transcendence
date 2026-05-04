import type { User } from './user';

export interface Message {
  id: number;
  content: string;
  Time?: Date;
  createdAt?: Date;
  userId: number;
  projectId: number;
  user?: User;
}
