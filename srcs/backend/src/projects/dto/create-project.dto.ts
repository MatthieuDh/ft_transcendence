import { IsString, IsOptional, MinLength, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}