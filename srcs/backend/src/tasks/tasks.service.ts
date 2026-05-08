import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(createTaskDto: CreateTaskDto, deadline: Date | null) {
    const { assigneeIds, ...taskData } = createTaskDto;

    if (assigneeIds && assigneeIds.length > 0) {
      const validMembers = await this.prisma.projectMember.findMany({
        where: {
          projectId: taskData.projectId,
          userId: { in: assigneeIds },
        },
      });

      if (validMembers.length !== assigneeIds.length) {
        throw new BadRequestException('Make sure all assignees are members of the project');
      }
    }

    const newTask = await this.prisma.task.create({
      data: {
        ...taskData,
        deadline: deadline,
        assignees: assigneeIds && assigneeIds.length > 0 ? {
          connect: assigneeIds.map((id) => ({ id: id })),
        } : undefined,
        statusHistory: {
          create: { status: TaskStatus.TODO }
        },
      },
      include: { assignees: { select: { id: true, username: true, avatar: true } } },
    });

    if (assigneeIds && assigneeIds.length > 0) {
      for (const userId of assigneeIds) {
        await this.notificationsService.createNotification(
          userId,
          'TASK_ASSIGNED',
          `You have been assigned to: ${newTask.title}`,
        );
      }
    }

    return newTask;
  }

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        assignees: { select: { id: true, username: true, avatar: true } },
        project: { select: { name: true } },
      },
    });
  }

  async findMyTasks(userId: number) {
    return this.prisma.task.findMany({
      where: {
        assignees: {
          some: { 
            id: userId 
          },
        },
      },
      include: {
        assignees: { select: { id: true, username: true, avatar: true } },
        project: { select: { name: true } },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        assignees: { select: { id: true, username: true, avatar: true } },
        project: { select: { name: true } },
      },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId?: number) {
    const { assigneeIds, ...taskData } = updateTaskDto;

    const currentTask = await this.prisma.task.findUnique({ 
      where: { id },
      include: { assignees: { select: { id: true } } } 
    });
    
    if (!currentTask) throw new NotFoundException('Task not found');

    if (assigneeIds?.length) {
      const validMembers = await this.prisma.projectMember.findMany({
        where: {
          projectId: currentTask.projectId,
          userId: { in: assigneeIds },
        },
      });
      if (validMembers.length !== assigneeIds.length) {
        throw new BadRequestException('Make sure all new assignees are members of the project');
      }
    }

    const statusChanged = taskData.status && taskData.status !== currentTask.status;
    const oldAssigneeIds = currentTask.assignees.map(a => a.id);
    const newlyAssignedIds = assigneeIds?.filter(id => !oldAssigneeIds.includes(id)) || [];

    if (taskData.deadline !== undefined) {
      (taskData as any).deadlineNotified = false;
    }

    const updatedTask = await this.prisma.$transaction(async (tx) => {
      const task = await tx.task.update({
        where: { id },
        data: {
          ...taskData,
          assignees: assigneeIds ? {
            set: assigneeIds.map((uid) => ({ id: uid })),
          } : undefined,
        },
        include: {
          assignees: true,
          project: {
            include: { members: { where: { role: 'PROJECT_LEADER' } } },
          },
        },
      });

      if (statusChanged) {
        await tx.taskStatusHistory.create({
          data: {
            taskId: id,
            status: taskData.status!,
            changedBy: userId ?? null,
          },
        });
      }

      return task;
    });

    if (statusChanged && updateTaskDto.status === 'PENDING_EVALUATION') {
      const leaderId = updatedTask.project.members[0]?.userId;
      if (leaderId) {
        await this.notificationsService.createNotification(
          leaderId,
          'TASK_PENDING_EVALUATION',
          `Task is pending evaluation: ${updatedTask.title}`,
        );
      }
    }

    if (newlyAssignedIds.length > 0) {
      for (const newUserId of newlyAssignedIds) {
        await this.notificationsService.createNotification(
          newUserId,
          'TASK_ASSIGNED',
          `You have been assigned to: ${updatedTask.title}`,
        );
      }
    }

    this.notificationsGateway.server
      .to(`project_${updatedTask.projectId}`)
      .emit('task_updated', updatedTask);

    return updatedTask;
  }

  async remove(id: number, currentUserId: number) {
    const task = await this.prisma.task.findUnique({
        where: { id: id },
        include: { assignees: true }
    });

    if (!task) {
        throw new NotFoundException('Task not found'); 
    }

    await this.prisma.task.delete({
        where: { id: id },
    });

    const targets = task.assignees
        .map(assignee => assignee.id)
        .filter(userId => userId !== currentUserId);

    targets.forEach(async userId => {
        this.notificationsGateway.server.to(`user_${userId}`).emit('new_notification', {
            type: 'TASK_DELETED',
            taskId: id,
            message: `The task "${task.title}" has been deleted.`,
        });
    });
    return { message: 'Task successfully deleted' };
  }
}