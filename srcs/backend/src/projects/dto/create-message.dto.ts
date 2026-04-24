import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ description: 'The ID of the user sending the message', example: 1 })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: 'The content of the chat message', example: 'Hello team!' })
  @IsString()
  @IsNotEmpty()
  content: string;
}