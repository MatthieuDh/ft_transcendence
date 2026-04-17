import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ProjectLeaderGuard } from './project-leader.guard'; // <--- 1. Importeer je nieuwe uitsmijter
import { ApiBearerAuth } from '@nestjs/swagger';
import { AddMemberDto } from './dto/add-member.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard) // you need to be loggen in before you can do ANYTHING with projects
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const userId = req.user.sub; 
    const deadlineDate = createProjectDto.deadline ? new Date(createProjectDto.deadline) : null;
    return this.projectsService.create(createProjectDto, userId, deadlineDate);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  // --- BEVEILIGDE PROJECT ROUTES ---

  @UseGuards(ProjectLeaderGuard) 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @UseGuards(ProjectLeaderGuard) 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }

  @UseGuards(ProjectLeaderGuard) 
  @Post(':id/members')
  addMember(
    @Param('id') id: string, 
    @Body() addMemberDto: AddMemberDto
  ) {
    return this.projectsService.addMember(+id, addMemberDto.userId, addMemberDto.role);
  }
}