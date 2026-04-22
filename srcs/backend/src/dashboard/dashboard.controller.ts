import { Controller, Get, ParseIntPipe, UseGuards, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ProjectLeaderGuard } from 'src/projects/project-leader.guard';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    getGlobalMetrics(){
        return this.dashboardService.getGlobalMetrics();
    }

    @Get('projects/:id')
    @UseGuards(JwtAuthGuard,ProjectLeaderGuard)
    getProjectMetrics(@Param('id', ParseIntPipe) id: number){
        return this.dashboardService.getProjectMetrics(id);
    }
}
