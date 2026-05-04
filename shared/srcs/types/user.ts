export enum GlobalRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface ProjectMembershipRef {
  id: number;
  project?: { id: number; name: string };
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  globalRole: GlobalRole;
  role?: GlobalRole;
  createdAt: Date;
  updatedAt?: Date;
  projectMemberships?: ProjectMembershipRef[];
}

export interface PromotedUser {
  id: number;
  username: string;
  globalRole: GlobalRole;
}
