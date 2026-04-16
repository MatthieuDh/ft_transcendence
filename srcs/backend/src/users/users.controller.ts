import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('promote/:username')
  promote(@Param('username') username: string, @Request() req) {
    const currentUser = req.user;
    
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Nice try, but only admins can promote users!');
    }
    
    return this.usersService.promote(username);
  }

  // -------------------------------
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('demote/:username')
  demote(@Param('username') username: string, @Request() req) {
    const currentUser = req.user;
    
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Nice try, but only admins can demote users!');
    }
    
    return this.usersService.demote(username, currentUser.username);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}