import type { TaskStatus } from "./task";
import type { ProjectStatus } from "./project";


export interface DashboardFilters {
    from?: string;
    to?: string;
    memberId?: number;
    projectStatus?: ProjectStatus;
    taskStatus?: TaskStatus;
}

export type ProjectRiskLevel = 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'CRITICAL';

export interface ProjectHealthItem {
    id: number;
    name: string;
    status: ProjectStatus;
    overdue: number;
    pendingLong: number;
    risk: ProjectRiskLevel;
}

export interface DashboardMetrics {
    totalProjects: number;
    completedProjects: number;
    averageProjectAgeDays?: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    pendingCount: number;
    pendingOverLimit: number;
    projectHealthList: ProjectHealthItem[];
    avgTimePerStage: Record<TaskStatus, number>;
    averageCompletionTime?: number;
    pendingOverlimit?: number;
}