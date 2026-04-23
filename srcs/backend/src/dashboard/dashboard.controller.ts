import { Controller, Get, Query, ParseIntPipe, UseGuards, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ProjectLeaderGuard } from 'src/projects/project-leader.guard';
import { DashboardFiltersDto } from './dto/dashboard-filters.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    getGlobalMetrics(
        @Query() filters: DashboardFiltersDto){
        return this.dashboardService.getGlobalMetrics(
            {
                from: filters.from ? new Date(filters.from) : undefined,
                to: filters.to ? new Date(filters.to) : undefined,
                memberId: filters.memberId,
                projectStatus: filters.projectStatus,
            }
        );
    }

    @Get('projects/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard,ProjectLeaderGuard)
    getProjectMetrics(
        @Param('id', ParseIntPipe) id: number,
        @Query() filters: DashboardFiltersDto
    ){
        return this.dashboardService.getProjectMetrics(id, {
            from: filters.from ? new Date(filters.from) : undefined,
            to: filters.to ? new Date(filters.to) : undefined,
            memberId: filters.memberId,
            taskStatus: filters.taskStatus,
        });
    }
}
