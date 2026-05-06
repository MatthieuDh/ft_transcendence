import { Controller, Param, ParseIntPipe, UploadedFiles, UseGuards, UseInterceptors, Post, Body, Request, Get,  } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { use } from 'passport';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor';
import { CreateCommentDto } from './dto/create-command.dto';
import { diskStorage } from 'multer';
import { Express } from 'express';
import 'multer';



@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks/:taskId/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                content: { type: 'string', example: 'Here is the document you needed.' },
                files: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Optional attachments for the comment',
                },
            },
        },
    })
    @UseInterceptors(FilesInterceptor('files', 10, { storage: diskStorage({ destination: './uploads/comments', filename: (req, file, cb) => { const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); cb(null, `${uniqueSuffix}-${file.originalname}`); }, }), }))
    
    async createComment(@Request() req, @Param('taskId', ParseIntPipe) taskId: number, @Body() createCommentDto: CreateCommentDto, @UploadedFiles() files: Express.Multer.File[]) {
        const filePaths = files ? files.map(file => file.filename) : [];
        return this.commentsService.createcomment(taskId, req.user.sub, createCommentDto, filePaths);
    }


 @Get()
    @ApiOperation({ summary: 'Get all comments for a specific task' })
    async getComments(
        @Param('taskId', ParseIntPipe) taskId: number,
        @Request() req
    ) {
        const comments = await this.commentsService.findallcomments(taskId);
        
        return comments.map(comment => ({ 
            ...comment, 
            attachments: comment.attachments.map(fileName => 
                `/api/uploads/comments/${fileName}`
            ),
            replies: comment.replies ? comment.replies.map(reply => ({
                ...reply,
                attachments: reply.attachments.map(fileName => 
                    `/api/uploads/comments/${fileName}`
                )
            })) : []
        }));
    }
}

