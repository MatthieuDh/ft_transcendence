import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) {}

    async getGlobalMetrics() {
        const now = new Date();

        const [projects, tasks] = await Promise.all([
            this.prisma.project.findMany({
                include: {
                    tasks: {
                        include: { statusHistory: { orderBy: { changedAt: 'asc'}}},
                    },
                }
            }),
            this.prisma.task.findMany({
                include: { statusHistory: { orderBy: { changedAt: 'asc'}}},
            }),
        ]);

        const totalProjects = projects.length;
        const completedProjects = projects.filter((p) => p.status === 'COMPLETED').length;
        const totalTasks = tasks.length;
        const pendingCount = tasks.filter((t) => t.status === 'PENDING_EVALUATION').length;
        const pendingOverLimit = tasks.filter((t) => this.isPendingTooLong(t, now)).length;
        const completedTasks = tasks.filter((t => t.status === 'DONE')).length;
        const overdueTasks = tasks.filter((t) => this.isOverdue(t, now)).length;
        const avgTimePerStage = this.computeAvgTimePerStage(tasks);
        const projectHealthList = projects.map((p) => {
            const overdue = p.tasks.filter((t) => this.isOverdue(t, now)).length;
            const pendingLong = p.tasks.filter((t) => this.isPendingTooLong(t, now)). length;
            const risk = this.computeRisk(overdue, pendingLong);
            return{
                id: p.id,
                name: p.name,
                status: p.status,
                overdue,
                pendingLong,
                risk,
            }
        });

        return{
            totalProjects,
            completedProjects,
            totalTasks,
            pendingCount,
            pendingOverLimit,
            completedTasks,
            overdueTasks,
            avgTimePerStage,
            projectHealthList,
        };
    }

    async getProjectMetrics(projectId: number) {
        const now = new Date();

        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                tasks: {
                    include: {
                        statusHistory: {
                            orderBy: { changedAt: 'asc' },
                        },
                    },
                },
            },
        });

        if (!project) {
            throw new Error('Project not found');
        }

        const tasks = project.tasks;
        const totalTasks = tasks.length;

        return {
            totalTasks,
            completedTasks: tasks.filter((t) => t.status === 'DONE').length,
            overdueTasks: tasks.filter((t) => this.isOverdue(t, now)).length,
            pendingOverlimit: tasks.filter((t) => this.isPendingTooLong(t, now)).length,
            averageCompletionTime: this.compouteCompletionTime(tasks),
            avgTimePerStage: this.computeAvgTimePerStage(tasks),
        };

    }

    private isOverdue(task: any, now: Date): boolean{
        return task.status !== 'DONE' && task.deadline && task.deadline < now;
    }

    private isPendingTooLong(task: any, now: Date, treshHoldDays = 7){
        if (task.status !== 'PENDING_EVALUATION') return false;
        const lastStatus = task.changeHistory(-1);
        if (!lastStatus) return false;
        const timediff = (now.getTime() - lastStatus.changedAt.getTime()) / (1000 * 60 * 60 *24);
        return timediff > treshHoldDays;
    }

    private compouteCompletionTime(tasks: any[]): number{
        const completedWithHistory = tasks.filter((t) => t.status === 'DONE' && t.statusHistory.length > 0);
        if (completedWithHistory.length === 0) return 0;
        const totalTime = completedWithHistory.reduce((acc, task) => {
            const start = new Date(task.statusHistoy[0].changedAt).getTime();
            const end = new Date(task.statusHistory.at(-1).changedAt).getTime();
            return acc + (end - start);
        }, 0);
        return totalTime / completedWithHistory.length;        
    }

        private computeRisk(overdue: number, pendingTooLong: number): string {
        if (overdue >= 5 || pendingTooLong >= 3) return 'CRITICAL';
        if (overdue >= 3 || pendingTooLong >= 1) return 'AT_RISK';
        if (overdue >= 1 || pendingTooLong >= 0) return 'WATCH';
        return 'HEALTHY';
    }

    private computeAvgTimePerStage(tasks: any[]){
        const stageTotals: Record<string, { total: number, count: number } > = {
            TODO: { total: 0, count : 0 },
            IN_PROGRESS: { total: 0, count: 0 },
            PENDING_EVALUATION: { total: 0, count: 0},
            DONE: { total:0, count: 0 },
        };

        for (const task of tasks) {
            const history = task.statusHistory;
            for (let i = 0; i < history.length; i++) {
                const current = history[i];
                const next = history[i + 1];
                const end = next ? next.changedAt : new Date();
                const days = end.getTime() - current.changedAt.getTime() / (1000 * 60 * 60 * 24);
                if (stageTotals[current.status]) {
                    stageTotals[current.status].total += days;
                    stageTotals[current.status].count += 1;
                }
            }
        }
        return Object.fromEntries(
            Object.entries(stageTotals).map(([stage, {total, count}]) => [
                stage,
                count > 0 ? Math.round((total/count) *10) / 10 : 0,
            ]),
        );
    }
}
    


