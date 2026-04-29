import type { ProjectMember } from "./project";

export enum GlobalRole{
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface User{
    id: number;
    username: string;
    email: string;
    avatar: string | null;
    globalRole: GlobalRole;
    createdAt: Date;
    projectMembership: ProjectMember[] | null;
}

export interface PromotedUser {
  id: number;
  username: string;
  globalRole: GlobalRole;
}