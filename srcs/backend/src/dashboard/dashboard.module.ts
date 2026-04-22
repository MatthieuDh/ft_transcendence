import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ProjectLeaderGuard } from 'src/projects/project-leader.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, ProjectLeaderGuard, JwtAuthGuard, RolesGuard],
  imports: [PrismaModule]
})
export class DashboardModule {}
