import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  status?: any;

  @IsOptional()
  deadline?: string | Date | null;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  assigneeIds?: number[];
}