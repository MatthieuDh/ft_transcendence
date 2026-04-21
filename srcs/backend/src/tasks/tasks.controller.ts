import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ProjectLeaderGuard } from 'src/projects/project-leader.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    const deadlineDate = createTaskDto.deadline ? new Date(createTaskDto.deadline) : null;
    return this.tasksService.create(createTaskDto, deadlineDate);
  }
@ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('all')
  findAllAdmins() {
    return this.tasksService.findAll(); 
  }

@ApiBearerAuth()
  @UseGuards(JwtAuthGuard) 
  @Get()
  findMyTasks(@Request() req) {
    return this.tasksService.findMyTasks(req.user.sub);
  }


  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @UseGuards(RolesGuard, ProjectLeaderGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}