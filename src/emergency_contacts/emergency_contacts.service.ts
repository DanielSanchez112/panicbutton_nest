import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmergencyContactDto } from './dto/create-emergency_contact.dto';
import { UpdateEmergencyContactDto } from './dto/update-emergency_contact.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EmergencyContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmergencyContactDto: CreateEmergencyContactDto) {
    const existingContact = await this.prisma.emergency_contacts.findFirst({
      where: { contact_id: createEmergencyContactDto.contact_id },
    })
    if (existingContact) {
      throw new NotFoundException(`Emergency contact with ID ${createEmergencyContactDto.contact_id} already exists`);
    }

    return await this.prisma.emergency_contacts.create({
      data: createEmergencyContactDto
    })
  }

  async findAll() {
    const contacts = await this.prisma.emergency_contacts.findMany({
      where: { active: true },
    })
    if (contacts.length === 0) {
      throw new NotFoundException('No active emergency contacts found');
    }
    return contacts
  }

  async findByUserId(id: number){
    const contacts = await this.prisma.emergency_contacts.findMany({
      where: { user_id: BigInt(id), active: true },
    })
    if (contacts.length === 0) {
      throw new NotFoundException(`No active emergency contacts found for user ID ${id}`);
    }
    return contacts;
  }

  async findOne(id: number) {
    const contact = await this.prisma.emergency_contacts.findUnique({
      where: { id: BigInt(id), active: true },
    });

    if (!contact) {
      throw new NotFoundException(`Emergency contact with ID ${id} not found`);
    }

    return contact;
  }

  async update(id: number, updateEmergencyContactDto: UpdateEmergencyContactDto) {
    const contact = await this.prisma.emergency_contacts.findUnique({
      where: { id: BigInt(id), active: true },
    });

    if (!contact) {
      throw new NotFoundException(`Emergency contact with ID ${id} not found`);
    }

    return await this.prisma.emergency_contacts.update({
      where: { id: BigInt(id) },
      data: updateEmergencyContactDto
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
