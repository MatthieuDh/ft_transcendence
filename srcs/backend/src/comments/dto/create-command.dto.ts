import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @IsString()
    content: string;

    @ApiProperty({ description: 'the text of the comment', example: 'here is the document you needed.' })
    @IsString()
    @IsNotEmpty()
    parentId?: number;
}