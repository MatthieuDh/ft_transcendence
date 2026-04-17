import { IsString, IsNotEmpty, IsInt, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  assigneeIds?: number[]; 
}