import { Injectable, ConflictException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // --- PROJECT AANMAKEN ---
  async create(createProjectDto: CreateProjectDto, userId: number, deadline: Date | null) {
    // 1. Create project and capture result in newProject variable
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

    // 2. Send notification to the creator (PROJECT_LEADER)
    for (const member of newProject.members) {
      await this.notificationsService.createNotification(
        member.userId,
        'PROJECT_CREATED',
        `Project successfully created: ${newProject.name}`
      );
    }

    // 3. Return the created project
    return newProject;
  }

  // --- MEMBER TOEVOEGEN ---
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

    // 1. Create new member and include project name for the notification
    const newMember = await this.prisma.projectMember.create({
      data: {
        projectId: projectId,
        userId: userId,
        role: role,
      },
      include: {
        user: { select: { username: true } },
        project: { select: { name: true } } // We need this to show the name in the notification!
      }
    });

    // 2. Send live notification to the newly added user
    await this.notificationsService.createNotification(
      userId,
      'PROJECT_JOINED',
      `You have been added to the project: ${newMember.project.name} as ${role}`
    );

    // 3. Return the new member
    return newMember;
  }

  // --- ALLE PROJECTEN OPHALEN ---
  async findAll() {
    return this.prisma.project.findMany();
  }

  // --- ÉÉN PROJECT OPHALEN ---
  async findOne(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { members: true } 
    });
  }

  // --- PROJECT UPDATEN ---
  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  // --- PROJECT VERWIJDEREN ---
  async remove(id: number) {
    return this.prisma.project.delete({
      where: { id }
    });
  }
}