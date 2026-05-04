import type { Task } from './task';
import type { Message } from './message';
import type { User } from './user';

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export enum ProjectRole {
  PROJECT_LEADER = 'PROJECT_LEADER',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST'
}

export interface ProjectMember {
  id: number;
  userId: number;
  projectId: number;
  role: ProjectRole;
  joinedAt?: Date;
  user?: User;
  project?: { id: number; name: string };
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  deadline?: Date;
  createdAt: Date;
  updatedAt?: Date;
  status: ProjectStatus;
  members?: ProjectMember[];
  tasks?: Task[];
  messages?: Message[];
}
