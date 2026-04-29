import { User } from "./user";
import { Task } from "./task";

export interface Comment{
    user: User;
    task: Task;
    parrentComment?: Comment;
    replies?: Comment[];
    createdAt: Date;
    attachments: string[];
    content: string;
}