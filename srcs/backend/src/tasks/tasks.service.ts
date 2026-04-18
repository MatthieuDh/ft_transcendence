import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, deadline: Date | null) {
    const { assigneeIds, ...taskData } = createTaskDto;

    // Create task and capture result in newTask variable
    const newTask = await this.prisma.task.create({
      data: {
        ...taskData,
        deadline: deadline,
        assignees: assigneeIds && assigneeIds.length > 0 ? {
          connect: assigneeIds.map((id) => ({ id: id })),
        } : undefined,
      },
      include: { assignees: { select: { id: true, username: true } } },
    });

    // Notify each assigned user
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

  async findAll(user: any) {
    // Admins see everything, users see tasks of their projects
    if (user.role === 'ADMIN') {
      return this.prisma.task.findMany({
        include: {
          assignees: { select: { username: true } },
          project: { select: { name: true } },
        },
      });
    }

    return this.prisma.task.findMany({
      where: {
        project: {
          members: {
            some: { userId: user.sub },
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

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const { assigneeIds, ...taskData } = updateTaskDto;
    
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        ...taskData,
        assignees: assigneeIds ? {
          set: assigneeIds.map((userId) => ({ id: userId })),
        } : undefined,
      },
      include: { 
        assignees: true,
        project: {
          include: { members: { where: { role: 'PROJECT_LEADER' } } }
        }
      },
    });

    // Notify project leader if status is changed to DONE
    if (updateTaskDto.status === 'DONE') {
      const leaderId = updatedTask.project.members[0]?.userId;
      if (leaderId) {
        await this.notificationsService.createNotification(
          leaderId,
          'TASK_DONE',
          `Task completed: ${updatedTask.title}`
        );
      }
    }

    return updatedTask;
  }

  async remove(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}