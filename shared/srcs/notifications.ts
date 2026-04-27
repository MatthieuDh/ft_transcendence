import { User } from "./user";

export interface Notifications{
    user: User;
    message: string;
    createdAt: Date;
}