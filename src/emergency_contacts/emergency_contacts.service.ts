import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmergencyContactDto } from './dto/create-emergency_contact.dto';
import { UpdateEmergencyContactDto } from './dto/update-emergency_contact.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EmergencyContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmergencyContactDto: CreateEmergencyContactDto) {
    const data = {
      ...createEmergencyContactDto,
      user_id: createEmergencyContactDto.user_id ? BigInt(createEmergencyContactDto.user_id) : undefined,
    };

    return await this.prisma.emergency_contacts.create({
      data,
      include: {
        users: true,
        alerts: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.emergency_contacts.findMany({
      include: {
        users: true,
        alerts: true,
      },
    });
  }

  async findOne(id: number) {
    const contact = await this.prisma.emergency_contacts.findUnique({
      where: { id: BigInt(id) },
      include: {
        users: true,
        alerts: true,
      },
    });

    if (!contact) {
      throw new NotFoundException(`Emergency contact with ID ${id} not found`);
    }

    return contact;
  }

  async update(id: number, updateEmergencyContactDto: UpdateEmergencyContactDto) {
    const contact = await this.prisma.emergency_contacts.findUnique({
      where: { id: BigInt(id) },
    });

    if (!contact) {
      throw new NotFoundException(`Emergency contact with ID ${id} not found`);
    }

    const data = {
      ...updateEmergencyContactDto,
      user_id: updateEmergencyContactDto.user_id ? BigInt(updateEmergencyContactDto.user_id) : undefined,
    };

    return await this.prisma.emergency_contacts.update({
      where: { id: BigInt(id) },
      data,
    });
  }

  async remove(id: number) {
    const contact = await this.prisma.emergency_contacts.findUnique({
      where: { id: BigInt(id) },
    });

    if (!contact) {
      throw new NotFoundException(`Emergency contact with ID ${id} not found`);
    }

    return await this.prisma.emergency_contacts.delete({
      where: { id: BigInt(id) },
    });
  }

  async toggleActive(id: number) {
    const contact = await this.prisma.emergency_contacts.findUnique({
      where: { id: BigInt(id) },
    });

    if (!contact) {
      throw new NotFoundException(`Emergency contact with ID ${id} not found`);
    }

    return await this.prisma.emergency_contacts.update({
      where: { id: BigInt(id) },
      data: { active: !contact.active },
    });
  }
}
