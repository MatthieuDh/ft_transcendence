import { User } from "./user";
import { Project } from "./project";

export interface Messages{
    user: User;
    project: Project;
    content: string;
}