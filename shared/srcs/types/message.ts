import { User } from "./user";
import { Project } from "./project";

export interface Message{
    user: User;
    project: Project;
    content: string;
}