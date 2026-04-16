import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectLeaderGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // 1. Wie ben jij? (Komt uit de AuthGuard die vóór deze guard draait)
    const userId = request.user.sub; 
    
    // 2. Welk project probeer je aan te passen? (Haalt de ':id' uit de URL)
    const projectId = parseInt(request.params.id); 

    if (isNaN(projectId)) {
      throw new ForbiddenException('Geen geldig project ID opgegeven.');
    }

    // 3. De Database Check: Zoek jouw specifieke rol in dit specifieke project
    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });

    // 4. Het Oordeel
    if (!member) {
      throw new ForbiddenException('you do not have the right to access this project!');
    }

    if (member.role !== 'PROJECT_LEADER') {
      throw new ForbiddenException('you do not have the right to access this project!');
    }

    // Alles klopt? Groen licht!
    return true; 
  }
}