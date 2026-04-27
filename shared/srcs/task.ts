import { User } from "./user";
import { Project } from "./project";

export enum TaskStatus{
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    PENDING_EVALUATION = 'PENDING_EVALUTION',
    DONE = 'DONE'
}

export interface Task{
    title: string;
    description?: string;
    status: TaskStatus;
    deadline?: Date;
    createdAt: Date;
    updatedAt: Date;
    comments?: Comment[];
    assignee?: User[];
    project: Project;    
}