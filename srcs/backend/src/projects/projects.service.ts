import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // --- PROJECT AANMAKEN (Inclusief automatische leider) ---
  async create(createProjectDto: CreateProjectDto, userId: number, deadline: Date | null) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        deadline: deadline,
        // Prisma 'Nested Writes': Make a new project AND create a new member in the same action
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
  }

// add a new member to a project, but first check if they are already a member of that project
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

    return this.prisma.projectMember.create({
      data: {
        projectId: projectId,
        userId: userId,
        role: role,
      },
      include: {
        user: {
          select: { username: true }
        }
      }
    });
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

  // --- PROJECT UPDATEN ---
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