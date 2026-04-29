import { User } from "./user";

export interface Notification{
    user: User;
    message: string;
    createdAt: Date;
}