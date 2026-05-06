import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCommentDto {
    @ApiProperty({ description: 'the text of the comment', example: 'here is the document you needed.' })
    @IsString()
    @IsNotEmpty()
    content: string;

    
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    parentId?: number;
}