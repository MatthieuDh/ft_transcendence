import type { TaskStatus } from "./task";
import type { ProjectStatus } from "./project";


export interface DashboardFilters {
    from?: string;
    to?: string;
    memberId?: number;
    projectStatus?: ProjectStatus;
    taskStatus?: TaskStatus;
}

export interface DashboardMetrics{
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    pendingOverLimit: number;
    averageCompletionTime: number;
    avgTimePerStage: Record<TaskStatus, number>;
}