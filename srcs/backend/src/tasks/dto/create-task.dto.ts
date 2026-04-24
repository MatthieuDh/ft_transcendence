import { TaskStatus } from '@prisma/client';
import { IsString, IsNotEmpty, IsInt, IsOptional, IsArray, IsDateString, IsEnum  } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsNotEmpty()
  projectId!: number;

  @IsOptional()
  @IsEnum(TaskStatus) 
  status?: TaskStatus;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  assigneeIds?: number[]; 
}


