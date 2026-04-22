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
        //count the number of tasks that are past their deadline
        const overdueCount = tasks.filter(
            (t) => t.status !== 'DONE' && t.deadline && t.deadline < now,
        ).length;

        //filter on pending evaluation and count the ones that have been like that for more than 7 days
        const pendingTasks= tasks.filter((t) => t.status === 'PENDING_EVALUATION');
        const pendingOverLimit = pendingTasks.filter((t) => {
            const entry = t.statusHistory.findLast((h) => h.status === 'PENDING_EVALUATION')
            if (!entry) return false;
            const days = (now.getTime() - entry.changedAt.getTime()) / (1000 * 60 *60 *24);
            return days > 7;
        }).length;
        //get the amount of completed tasks and projects
        const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
        const completedProjects = projects.filter((p) => p.status === 'COMPLETED').length;

        const avgTimePerStage = this.computeAvgTimePerStage(tasks);

        const projectHealthList = projects.map((p) =>{
            const totalTasks = p.tasks.length;
            const doneTasks = p.tasks.filter((t) => t.status === 'DONE').length;
            const overdue = p.tasks.filter(
                (t) => t.status !== 'DONE' && t.deadline && t.deadline < now,
            ).length;
            const longPending = p.tasks.filter((t) => {
                if (t.status !== 'PENDING_EVALUATION') return false;
                const entry = t.statusHistory.findLast((h) => h.status === 'PENDING_EVALUATION');
                if (!entry) return false;
                const days = (now.getTime() - entry.changedAt.getTime()) / (1000 * 60 * 60 * 24);
                return days > 7;
            }).length;

            const risk =
                overdue >= 5 || longPending >= 3 ? 'CRITICAL' :
                overdue >= 2 || longPending >= 1 ? 'AT_RISK' :
                overdue >= 1 ? 'WATCH' : 'HEALTHY';

            return { id: p.id, name: p.name, status: p.status, overdue, longPending, risk };
            
        });
        
        return {
            overdueCount,
            pendingCount: pendingTasks.length,
            pendingOverLimit,
            completedTasks,
            completedProjects,
            avgTimePerStage,
            projectHealthList,
        };
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

    // Total tasks
    const totalTasks = tasks.length;

    // Completed tasks
    const completedTasks = tasks.filter(
        (t) => t.status === 'DONE'
    ).length;

    // Overdue tasks
    const overdueTasks = tasks.filter(
        (t) =>
            t.status !== 'DONE' &&
            t.deadline &&
            new Date(t.deadline) < now
    ).length;

    // Tasks pending evaluation for too long
    const pendingEvaluationTasks = tasks.filter((t) => {
        if (t.status !== 'PENDING_EVALUATION') return false;

        const lastStatus = t.statusHistory.at(-1);
        if (!lastStatus) return false;

        const timeDiff = now.getTime() - new Date(lastStatus.changedAt).getTime();

        return timeDiff > 1000 * 60 * 60 * 24 * 7;
    }).length;

    // Average completion time (only completed tasks)
    const completedWithHistory = tasks.filter(
        (t) => t.status === 'DONE' && t.statusHistory.length > 0
    );

    let averageCompletionTime = 0;

    if (completedWithHistory.length > 0) {
        const totalTime = completedWithHistory.reduce((acc, task) => {
            const start = new Date(task.statusHistory[0].changedAt).getTime();
            const end =
                new Date(task.statusHistory.at(-1)!.changedAt).getTime();

            return acc + (end - start);
        }, 0);

        averageCompletionTime =
            totalTime / completedWithHistory.length;
    }

    return {
        totalTasks,
        completedTasks,
        overdueTasks,
        pendingEvaluationTasks,
        averageCompletionTime,
    };
}
}

