import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {

  @ApiProperty({ description: 'The content of the chat message', example: 'Hello team!' })
  @IsString()
  @IsNotEmpty()
  content: string;
}