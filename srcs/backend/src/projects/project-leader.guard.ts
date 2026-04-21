import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectLeaderGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    const globalRole = request.user.globalRole;

    if (globalRole === 'ADMIN') { //for now admin has all permissions, we can change this later if we want to
      return true;
    }

    let projectId: number;
    const path = request.route.path;

    if (path.includes('/tasks')) {
      const taskId = parseInt(request.params.id);
      if (isNaN(taskId)) throw new ForbiddenException('Invalid task ID provided');

      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
        select: { projectId: true }
      });

      if (!task) throw new ForbiddenException('Task not found');
      projectId = task.projectId;
    } else {
      projectId = parseInt(request.params.id);
    }

    if (isNaN(projectId)) {
      throw new ForbiddenException('Invalid project ID provided');
    }

    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });

    if (!member || member.role !== 'PROJECT_LEADER') {
      throw new ForbiddenException('You do not have permission to modify this project');
    }

    return true;
  }
}