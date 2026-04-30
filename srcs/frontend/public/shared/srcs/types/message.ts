export interface Message {
  id: number;
  content: string;
  projectId: number;
  createdAt: Date;
  user: { username: string; avatar: string };
}