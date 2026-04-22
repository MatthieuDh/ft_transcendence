import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'The id of the user who should receive the notification', example: 1 })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: 'The type of the notification (e.g., SYSTEM, PROJECT_JOINED)', example: 'SYSTEM' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'The text of the notification', example: 'Hello, this is a test notification via Swagger!' })
  @IsString()
  @IsNotEmpty()
  message: string;
}