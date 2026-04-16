import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard) // <-- Check if the user is logged in first, THEN check their role
  @Roles('ADMIN')                   // <-- The magic tag! Only ADMINs can access this route
  @Patch('promote/:username')
  promote(@Param('username') username: string) {
    // If the execution reaches this point, we are 100% sure the user is an ADMIN.
    return this.usersService.promote(username);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('demote/:username')
  demote(@Param('username') username: string, @Request() req) {
    // to the service (e.g., to prevent an admin from demoting themselves).
    return this.usersService.demote(username, req.user.username);
  }
}