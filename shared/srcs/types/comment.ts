export interface Comment {
  id: number;
  content: string;
  taskId: number;
  userId: number;
  parentId?: number;
  attachments: string[]; //full URL's
  createdAt: Date;
  user: { id: number; username: string; avatar: string };
  replies?: Comment[];
}