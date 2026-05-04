import type { User } from './user';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_EVALUATION = 'PENDING_EVALUATION',
  DONE = 'DONE'
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  projectId: number;
  comments?: Comment[];
  assignees?: User[];
}
