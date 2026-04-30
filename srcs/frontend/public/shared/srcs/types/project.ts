import type { Task } from "./task";
import type { Message } from "./message";

export enum ProjectStatus{
    PLANNING = 'PLANNING',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED'
}

export enum ProjectRole{
    PROJECT_LEADER = 'PROJECT_LEADER',
    MEMBER = 'MEMBER',
    GUEST = 'GUEST'
}

export interface ProjectMember{
    id: number;
    userId: number;
    role: ProjectRole;
    projectId: number;
    user?: {username: string};
    project?: {name: string};
}

export interface Project {
    id: number;
    name: string;
    description?: string;
    deadline?: Date;
    createdAt: Date;
    status: ProjectStatus;
    members?: ProjectMember[];
    tasks?: Task[];
    messages?: Message[];
}