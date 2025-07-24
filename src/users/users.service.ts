import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: createUserDto.email }
    })
    if(existingUser){
      throw new NotFoundException(`User with email ${createUserDto.email} already exists`);
    }
    return await this.prisma.users.create({
      data: createUserDto,
    });
  }

  async findAll() {
    const users = await this.prisma.users.findMany({
      where: { active: true },
    })
    if(users.length === 0){
      throw new NotFoundException('No active users found');
    }
    return users
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id), active: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id), active: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return await this.prisma.users.update({
      where: { id: BigInt(id) },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return await this.prisma.users.delete({
      where: { id: BigInt(id) },
    });
  }

  async toggleActive(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return await this.prisma.users.update({
      where: { id: BigInt(id) },
      data: { active: !user.active },
    });
  }
}
