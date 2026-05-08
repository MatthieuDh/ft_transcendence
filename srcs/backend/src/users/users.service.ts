import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService} from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt';
import { GlobalRole } from '@prisma/client';
import { ChangePasswordDto } from './dto/changePasswordDto';

const userSelect = {
  id: true,
  username: true,
  email: true,
  globalRole: true,
  avatar: true,
  createdAt: true,
  projectMemberships: {
    select: {
      role: true,
      projectId: true,
      project: {
        select: {
          name: true,
          description: true,
          deadline: true,
        },
      },
    },
  },
};

export type SafeUser = {
  id: number;
  username: string;
  email: string | null;
  globalRole: GlobalRole;
  avatar: string | null;
  createdAt: Date;
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}


  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.password) throw new Error('Password is required');
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const userCount = await this.prisma.user.count();
      const globalRole = userCount === 0 ? 'ADMIN' : 'USER'; 
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        globalRole: globalRole,
      },
      select: userSelect,
    });
  }

  async createOAuthUser(data: { email: string; googleId: string; username: string }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        googleId: data.googleId,
        username: data.username,
      },
    select: userSelect,
  });
}

  async findAll() {
    return this.prisma.user.findMany({
      select: userSelect,
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  }

  async findByName(username: string){
    return this.prisma.user.findUnique({
      where: { username }
    });
  }
  async findByGoogleId(googleId: string){
    return this.prisma.user.findUnique({
      where: { googleId }
    })
  }

  async findByEmail(email: string){
    return this.prisma.user.findUnique({
      where: { email }
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: { 
        username: updateUserDto.username, 
        email: updateUserDto.email ,
        avatar: updateUserDto.avatar},
      select: userSelect,
    });
  }

  async changePassword(id: number, dto: ChangePasswordDto){
    
    const user = await this.prisma.user.findUnique({
      where: { id },});
      
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!user.password){
      throw new BadRequestException('User does not have a password set');
    }
    const passwordMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });

  
  }

  async updateByName(username: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { username },
      data: updateUserDto,
      select: userSelect,
    });
  }

  async updateGoogleId(id: number, googleId: string){
    return this.prisma.user.update({
      where: { id },
      data: { googleId },
    })
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id }
    });
  }

  async removeByName(username: string) {
    return this.prisma.user.delete({
      where: { username }
    });
  }

  async promote(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { globalRole: 'ADMIN'}, 
      select: {
        id: true,
        username: true,
        globalRole: true,   
      }
    });
  }


  async demote(userId: number, adminId: number) {
    if (userId == adminId) {
      throw new ForbiddenException('You cannot demote yourself');
    }
    const adminCount = await this.prisma.user.count({
      where: {globalRole: 'ADMIN'}
    });
    if (adminCount <= 1){
      throw new ForbiddenException('Cannot demote the last admin');
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: { globalRole: 'USER' },
      select: {
        id: true,
        username: true,
        globalRole: true,
      }
    });
  }
}