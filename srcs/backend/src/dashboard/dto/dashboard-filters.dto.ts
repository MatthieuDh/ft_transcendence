import { IsOptional, IsDateString, IsInt, IsEnum, IsString } from "class-validator";
import { TaskStatus, ProjectStatus } from "@prisma/client";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class DashboardFiltersDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    from?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    to?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    memberId?: number;

    @ApiPropertyOptional({ enum: ProjectStatus })
    @IsOptional()
    @IsEnum(ProjectStatus)
    projectStatus?: ProjectStatus;

    @ApiPropertyOptional({ enum: TaskStatus })
    @IsOptional()
    @IsEnum(TaskStatus)
    taskStatus?: TaskStatus;
}