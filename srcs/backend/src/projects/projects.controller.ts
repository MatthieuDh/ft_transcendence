import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectLeaderGuard } from './project-leader.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // you need to be logged in before you can do ANYTHING with projects
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const userId = req.user.sub; 
    const deadlineDate = createProjectDto.deadline ? new Date(createProjectDto.deadline) : null;
    return this.projectsService.create(createProjectDto, userId);
  }

@UseGuards(JwtAuthGuard)
  @Get('my')
  findMyProjects(@Request() req) {
    return this.projectsService.findMyProjects(req.user.sub);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.projectsService.findOne(+id, req.user.sub, req.user.role);
  }

  @UseGuards(ProjectLeaderGuard) 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @UseGuards(ProjectLeaderGuard) 
  @Delete(':id')
  remove(@Param('id') id: string,
         @Request() req) {
    const currentUserId = req.user.sub;
    return this.projectsService.remove(+id, currentUserId);
  }

  @UseGuards(ProjectLeaderGuard) 
  @Post(':id/members')
  addMember(
    @Param('id') id: string, 
    @Body() addMemberDto: AddMemberDto
  ) {
    return this.projectsService.addMember(+id, addMemberDto.userId, addMemberDto.role);
  }

  @UseGuards(ProjectLeaderGuard)
  @Delete(':id/members/:userId')
  removeMember(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
    @Request() req
  ) {
    const currentUserId = req.user.sub;
    return this.projectsService.removeMember(+projectId, +userId, currentUserId);
  }

  @Post(':id/messages')
  createMessage(
    @Param('id') projectid: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request () req) {
    const currentUserId = req.user.sub;
    return this.projectsService.createmessage(+projectid, currentUserId, createMessageDto);
  }

  @Get(':id/messages')
  getMessages(@Param('id') projectId: string) {
    return this.projectsService.getProjectMessages(+projectId);
  }
}
