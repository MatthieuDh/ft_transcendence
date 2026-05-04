import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-command.dto';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService,
        private notificationGateway: NotificationsGateway) {}

    async createcomment(taskid: number, userId: number, createCommentDto: CreateCommentDto, files: string[] = []) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskid },
            include: { assignees: true ,
            project: { include: { members: { where: { role : 'PROJECT_LEADER' } } } } },
        });
        
        if (!task)
            throw new Error('Task not found');
            
        const isAssignee = task.assignees.some(a => a.id === userId);
        const isLeader = task.project.members.some(m => m.userId === userId);
        
        if (!isAssignee && !isLeader)
            throw new Error('You are not authorized to comment on this task');

        const comment = await this.prisma.comment.create({
            data: {
                content: createCommentDto.content,
                userId: userId,
                taskId: taskid,
                attachments: files,
                parentId: createCommentDto.parentId,
            },
            include: {
                user: { select: { id: true, username: true, avatar: true } },
                replies: { include: { user: { select: { id: true, username: true, avatar: true } } } },
            }
        });

        let notificationTargets: number[] = [];
        if (isLeader) {
            notificationTargets = task.assignees.map(a => a.id);
        }
        else if (isAssignee) {
            const leaderIds = task.project.members.map(m => m.userId);
            const otherAssignees = task.assignees
                .map(a => a.id)
                .filter(id => id !== userId);
            notificationTargets = [...leaderIds, ...otherAssignees];
        }
        const uniqueTargets = [...new Set(notificationTargets)].filter(id => id !== userId);
        uniqueTargets.forEach(targetId => {
            this.notificationGateway.server.to(`user_${targetId}`).emit('new_notification', {
                type: 'NEW_COMMENT',
                taskId: taskid,
                message: 'A new comment has been added to a task you are involved in.',
            });
        });

        this.notificationGateway.server.to(`project_${task.projectId}`).emit('new_task_comment', comment);

        return comment;
    }

    async findallcomments(taskid: number) {
        const comments = await this.prisma.comment.findMany({
            where: { taskId: taskid, parentId: null },
            include: { user: { select: { id: true, username: true, avatar: true } },
            replies: { include: { user: { select: { id: true, username: true, avatar: true } } } },
                },
            orderBy: { createdAt: 'asc' },
        });
        return comments;
    }
}