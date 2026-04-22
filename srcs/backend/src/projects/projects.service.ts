import { Injectable, ConflictException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async createmessage(projectId: number, userId: number, content: string) {
    const newMessage = await this.prisma.message.create({
      data: {
        content: content,
        projectId: projectId,
        userId: userId,
      },
      include: {
        user: {
          select: { username: true, avatar: true }
        }
      }
    });
    this.notificationsGateway.sendProjectNotification(projectId, newMessage);
    return newMessage;
  }

  async getProjectMessages(projectId: number) {
    return this.prisma.message.findMany({
      where: { projectId: projectId },
      orderBy: { Time : 'asc' },
      include: {
        user: {
          select: { username: true, avatar: true }
        }
      }
    });
  }

  async create(createProjectDto: CreateProjectDto, userId: number, deadline: Date | null) {
    const newProject = await this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        deadline: deadline,
        members: {
          create: {
            userId: userId,
            role: 'PROJECT_LEADER',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { username: true, globalRole: true, email: true }
            }
          }
        }
      }
    });

    for (const member of newProject.members) {
      await this.notificationsService.createNotification(
        member.userId,
        'PROJECT_CREATED',
        `Project successfully created: ${newProject.name}`
      );
    }
    return newProject;
  }

  async addMember(projectId: number, userId: number, role: any) {
    const existingMember = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException('This user is already a member of the project.');
    }
    const newMember = await this.prisma.projectMember.create({
      data: {
        projectId: projectId,
        userId: userId,
        role: role,
      },
      include: {
        user: { select: { username: true } },
        project: { select: { name: true } } 
      }
    });

    await this.notificationsService.createNotification(
      userId,
      'PROJECT_JOINED',
      `You have been added to the project: ${newMember.project.name} as ${role}`
    );
    return newMember;
  }

  async findAll() {
    return this.prisma.project.findMany();
  }

  async findOne(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { members: true } 
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: number) {
    return this.prisma.project.delete({
      where: { id }
    });
  }

  
}