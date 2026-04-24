import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ProjectLeaderGuard } from 'src/projects/project-leader.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ExportService } from 'src/export/export.service';
import { ExportModule } from 'src/export/export.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, ExportService, ProjectLeaderGuard, JwtAuthGuard, RolesGuard],
  imports: [PrismaModule, ExportModule]
})
export class DashboardModule {}
