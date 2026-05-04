import type { User } from './user';

export interface Comment {
  id: number;
  content: string;
  attachments: string[];
  createdAt: Date;
  userId: number;
  taskId: number;
  user?: User;
  parentId?: number;
  replies?: Comment[];
}
