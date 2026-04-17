import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service'; // Vergeet deze import niet!

@Injectable()
export class TasksService {
  // 1. Prisma toevoegen via de constructor
  constructor(private prisma: PrismaService) {}

  // 2. TAAK AANMAKEN
  async create(createTaskDto: CreateTaskDto, deadline: Date | null) {
    const { assigneeIds, ...taskData } = createTaskDto;
    return this.prisma.task.create({
      data: {
        ...taskData,
        deadline: deadline,
        assignees: assigneeIds && assigneeIds.length > 0 ? {
          connect: assigneeIds.map(id => ({ id: id }))
        } : undefined,
      },
      include: { assignees: { select: { id: true, username: true } } }
    });
  }

  // 3. ALLE TAKEN OPHALEN (Hier zit de magie voor jouw vraag!)
  async findAll(user: any) {
    // Check 1: Is de gebruiker een Global Admin? Dan mag hij alles zien.
    if (user.role === 'ADMIN') {
      return this.prisma.task.findMany({
        include: { 
          assignees: { select: { username: true } },
          project: { select: { name: true } } 
        }
      });
    }

    // Check 2: Normale user? Laat alleen taken zien van projecten waar de user lid is.
    return this.prisma.task.findMany({
      where: {
        project: {
          members: {
            some: {
              userId: user.sub // 'sub' is het ID van de ingelogde user uit het JWT token
            }
          }
        }
      },
      include: { 
        assignees: { select: { username: true } },
        project: { select: { name: true } } 
      }
    });
  }

  
  async findOne(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
      include: { 
        assignees: { select: { username: true } },
        project: { select: { name: true } } 
      }
    });
  }

  

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const { assigneeIds, ...taskData } = updateTaskDto;
    return this.prisma.task.update({
      where: { id },
      data: {
        ...taskData,
        assignees: assigneeIds ? {
          set: assigneeIds.map(userId => ({ id: userId }))
        } : undefined,
      },
      include: { assignees: { select: { username: true } } }
    });
  }

  // 6. TAAK VERWIJDEREN
  async remove(id: number) {
    return this.prisma.task.delete({
      where: { id }
    });
  }
}
