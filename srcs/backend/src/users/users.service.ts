import { ForbiddenException, Injectable } from '@nestjs/common';
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
        globalRole: true, // Aangepast van role naar globalRole
        email: true,
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
        globalRole: true, // Aangepast van role naar globalRole
        email: true,
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
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto, // Dit was UpdateUserDto (hoofdletter), moet kleine letter zijn
      select: {
        id: true,
        username: true,
        globalRole: true, // Aangepast van role naar globalRole
        avatar: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async updateByName(username: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ // Aangepast van prisma.update naar prisma.user.update
      where: { username },
      data: updateUserDto, // Dit was UpdateUserDto (hoofdletter), moet kleine letter zijn
      select: {
        id: true,
        username: true,
        globalRole: true, // Aangepast van role naar globalRole
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

  async promote(username: string) {
    return this.prisma.user.update({
      where: { username },
      data: { globalRole: 'ADMIN'}, // Aangepast van role naar globalRole
      select: {
        id: true,
        username: true,
        globalRole: true, // Aangepast van role naar globalRole
      }
    });
  }

  async demote(username: string, adminName: string) {
    if (username == adminName) {
      throw new ForbiddenException('You cannot demote yourself');
    }
    const adminCount = await this.prisma.user.count({
      where: {globalRole: 'ADMIN'} // Aangepast van role naar globalRole
    });
    if (adminCount <= 1){
      throw new ForbiddenException('Cannot demote the last admin');
    }
    return this.prisma.user.update({
      where: { username },
      data: { globalRole: 'USER' }, // Aangepast van role naar globalRole
      select: {
        id: true,
        username: true,
        globalRole: true, // Aangepast van role naar globalRole
      }
    });
  }
}