import { User } from "./user";
import { Task } from "./task";

export interface Comments{
    user: User;
    task: Task;
    parrentComment?: Comments;
    replies?: Comments[];
    createdAt: Date;
    attachments: string[];
    content: string;
}