import { Injectable, BadRequestException, NotFoundException, assignMetadata } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
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
      include: { assignees: { select: { id: true, username: true } } },
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

  // in tasks.service.ts

  // Wordt alleen door Admins aangeroepen via de Controller
  async findAll() {
    return this.prisma.task.findMany({
      include: {
        assignees: { select: { username: true } },
        project: { select: { name: true } },
      },
    });
  }

  // Wordt door normale users aangeroepen
  async findMyTasks(userId: number) {
    return this.prisma.task.findMany({
      where: {
        project: {
          members: {
            some: { userId: userId },
          },
        },
      },
      include: {
        assignees: { select: { username: true } },
        project: { select: { name: true } },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        assignees: { select: { username: true } },
        project: { select: { name: true } },
      },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId?: number) {
  const { assigneeIds, ...taskData } = updateTaskDto;

  const currentTask = await this.prisma.task.findUnique({ where: { id } });
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

  if (updateTaskDto.status === 'PENDING_EVALUATION') {
    const leaderId = updatedTask.project.members[0]?.userId;
    if (leaderId) {
      await this.notificationsService.createNotification(
        leaderId,
        'TASK_PENDING_EVALUATION',
        `Task is pending evaluation: ${updatedTask.title}`,
      );
    }
  }
}

  async remove(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { assignees: true },
    });

    if (task && task.assignees.length > 0) {
      for (const assignee of task.assignees) {
        await this.notificationsService.createNotification(
          assignee.id,
          'TASK_DELETED',
          `Task has been deleted: ${task.title}`
        );
      }
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}