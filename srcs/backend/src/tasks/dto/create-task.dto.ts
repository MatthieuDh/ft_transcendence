import { IsString, IsNotEmpty, IsInt, IsOptional, IsArray } from 'class-validator';

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

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  assigneeIds?: number[]; 
}