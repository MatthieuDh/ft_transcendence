import { Controller, Get, Query, ParseIntPipe, UseGuards, Param, Res, BadRequestException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ProjectLeaderGuard } from 'src/projects/project-leader.guard';
import { DashboardFiltersDto } from './dto/dashboard-filters.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ExportService } from 'src/export/export.service';
import type { Response } from 'express';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService,
        private readonly exportService: ExportService
    ) {}

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

    @Get('export')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async exportGlobalMetrics(
        @Query() filters: DashboardFiltersDto,
        @Query('format') format: string,
        @Res() res: Response,
    ) {
        const data = await this.dashboardService.getGlobalMetrics({
            from: filters.from ? new Date(filters.from) : undefined,
            to: filters.to ? new Date(filters.to) : undefined,
            memberId: filters.memberId,
            projectStatus: filters.projectStatus,
            taskStatus: filters.taskStatus,
        });

        if (format === 'csv') {
            const buffer = this.exportService.exportCsv(data);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=dashboard.csv');
            return res.send(buffer);
        }

        if (format === 'pdf') {
            const buffer = await this.exportService.exportPdf(data);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=dashboard.pdf');
            return res.send(buffer);
        }

        throw new BadRequestException('Unsupported format. Use csv or pdf.');
    }
}
