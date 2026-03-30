import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService} from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select:{
        id: true,
        username: true,
        role: true,
        avatar: true,
        createdAt: true,
      }
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async findByName(username: string){
    return this.prisma.user.findUnique({
      where: { username }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.update({
      where: { id },
      data: UpdateUserDto,
      select: {
        id: true,
        username: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

    async updateByName(username: string, updateUserDto: UpdateUserDto) {
    return this.prisma.update({
      where: { username },
      data: UpdateUserDto,
      select: {
        id: true,
        username: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      }
    });
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
}



