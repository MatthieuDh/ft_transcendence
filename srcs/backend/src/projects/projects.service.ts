import { Injectable, ConflictException, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { CreateMessageDto } from './dto/create-message.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async createmessage(projectId: number, userId: number, createMessageDto: CreateMessageDto) {
    const newMessage = await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        projectId: projectId, 
        userId: userId,
      },
      include: {
        user: {
          select: { username: true, avatar: true }
        }
      }
    });
    this.notificationsGateway.sendProjectNotification(projectId, {
      ...newMessage,
      projectId: projectId 
    });

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

  async create(createProjectDto: CreateProjectDto, userId: number) {
    const newProject = await this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        deadline: createProjectDto.deadline,
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

  async removeMember(projectId: number, userId: number, currentUserId: number)
  {
    const membership = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
      include: {
        project: {select: {name: true}},
        user: {select: {username: true}},
      }
    });
      if (!membership) {
        throw new NotFoundException('Member not found in this project.');
    }
    if (membership.role === 'PROJECT_LEADER')
    {
      const leaderCount = await this.prisma.projectMember.count({
        where: {projectId: projectId, role: 'PROJECT_LEADER'}
      });
        if (leaderCount <= 1) {
          throw new BadRequestException('Cannot remove the last project leader.');
      }
    }
    await this.prisma.projectMember.delete({
      where: {
        id: membership.id,
      },
    });
    if (userId !== currentUserId) {
        await this.notificationsService.createNotification(
          userId,
          'PROJECT_REMOVED',
          `You have been removed from the project: ${membership.project.name}`
        );
    }
    return { message: 'Member successfully removed' };
  }

  async findAll() {
    return this.prisma.project.findMany();
  }

async findOne(id: number, userId: number, role: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { 
        members: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true } 
            }
          }
        }, 
        tasks: {
          include: {
            assignees: {
              select: { id: true, username: true, avatar: true } 
            }
          }
        } 
      } 
    });
    if (!project)
      throw new NotFoundException('Project not found!')
    if (role !== 'ADMIN') {
      const isMember = project.members.some(m => m.userId === userId);
      if (!isMember) {
        throw new ForbiddenException('You are not a member of this project');
      }
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async findMyProjects(userId: number) {
    return this.prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: {
          where: { userId: userId },
          select: { role: true }
        }
      },
      orderBy: {
        deadline: 'asc',
      },
    });
  }

  async remove(id: number, currentUserId: number) {
    const project = await this.prisma.project.findUnique({
        where: { id: id },
        include: { members: true }
    });
    if (!project) {
        throw new Error('Project not found'); 
    }
    await this.prisma.project.delete({
        where: { id: id },
    });
    const target = project.members.map(member => member.userId).filter(userid => userid !== currentUserId);
    target.forEach(async userId => {
        this.notificationsGateway.server.to(`user_${userId}`).emit('new_notification', {
            type: 'PROJECT_DELETED',
            projectId: id,
            message: `The project ${project.name} has been deleted.`,
        });
    });
    return { message: 'Project successfully deleted' };
  }
}