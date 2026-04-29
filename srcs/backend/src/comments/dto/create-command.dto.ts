import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({ description: 'the text of the comment', example: 'here is the document you needed.' })
    @IsString()
    @IsNotEmpty()
    content: string;

    
    @IsInt()
    @IsOptional()
    parentId?: number;
}