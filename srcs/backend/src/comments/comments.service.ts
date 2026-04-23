import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-command.dto';
import { find } from 'rxjs';
import { assign } from 'nodemailer/lib/shared';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) {}

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
        });
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

