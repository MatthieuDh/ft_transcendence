import { Task } from "./task";
import { Messages } from "./messages";

export enum ProjectStatus{
    PLANNING = 'PLANNING',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED'
}

export enum ProjectRole{
    PROJECT_LEADER = ' PROJECT_LEADER',
    MEMBER = 'MEMBER',
    GUEST = 'GUEST'
}

export interface ProjectMember{
    projectRole: ProjectRole;
    projectId: number;
}

export interface Project{
    name: string;
    description?: string;
    deadline?: Date;
    createdAt: Date;
    status: ProjectStatus;
    member: ProjectMember[];
    tasks: Task[];
    messages: Messages[];
}