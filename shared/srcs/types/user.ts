export enum GlobalRole{
    USER = 'User',
    ADMIN = 'ADMIN'
}

export interface User{
    id: number;
    username: string;
    email: string;
    avatar: string;
    role: GlobalRole;
    createdAt: Date;
}