import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // --- PROJECT AANMAKEN (Inclusief automatische leider) ---
  async create(createProjectDto: CreateProjectDto, userId: number) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        // Prisma 'Nested Writes': Maak direct een lid aan en koppel die aan dit project
        members: {
          create: {
            userId: userId,
            role: 'PROJECT_LEADER',
          },
        },
      },
      // Haal direct de ledenlijst mee op als antwoord
      include: {
        members: {
          include: {
            user: {
              select: { username: true, globalRole: true }
            }
          }
        }
      }
    });
  }

// --- NIEUW LID TOEVOEGEN AAN PROJECT ---
  async addMember(projectId: number, userId: number, role: any) {
    // 1. Check of deze gebruiker al in dit specifieke project zit
    const existingMember = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException('Deze gebruiker is al lid van dit project!');
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

  // --- ALLE PROJECTEN OPHALEN ---
  async findAll() {
    return this.prisma.project.findMany();
  }

  // --- ÉÉN PROJECT OPHALEN ---
  async findOne(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { members: true } // Handig: haalt direct de ledenlijst mee op
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