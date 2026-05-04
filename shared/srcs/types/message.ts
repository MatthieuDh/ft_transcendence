export interface Message {
  id: number;
  content: string;
  projectId: number;
  userId: number;
  Time: Date;
  createdAt: Date;
  user: { username: string; avatar: string };
}