import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlertDto: CreateAlertDto) {
    const data = {
      ...createAlertDto,
      user_id: createAlertDto.user_id ? BigInt(createAlertDto.user_id) : undefined,
      contact_id: createAlertDto.contact_id ? BigInt(createAlertDto.contact_id) : undefined,
      alert_type_id: createAlertDto.alert_type_id ? BigInt(createAlertDto.alert_type_id) : undefined,
      dive_type_id: createAlertDto.dive_type_id ? BigInt(createAlertDto.dive_type_id) : undefined,
    };

    return await this.prisma.alerts.create({
      data,
      include: {
        users: true,
        emergency_contacts: true,
        alert_types: true,
        device_types: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.alerts.findMany({
      include: {
        users: true,
        emergency_contacts: true,
        alert_types: true,
        device_types: true,
      },
    });
  }

  async findOne(id: number) {
    const alert = await this.prisma.alerts.findUnique({
      where: { id: BigInt(id) },
      include: {
        users: true,
        emergency_contacts: true,
        alert_types: true,
        device_types: true,
      },
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    return alert;
  }

  async update(id: number, updateAlertDto: UpdateAlertDto) {
    const alert = await this.prisma.alerts.findUnique({
      where: { id: BigInt(id) },
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    const data = {
      ...updateAlertDto,
      user_id: updateAlertDto.user_id ? BigInt(updateAlertDto.user_id) : undefined,
      contact_id: updateAlertDto.contact_id ? BigInt(updateAlertDto.contact_id) : undefined,
      alert_type_id: updateAlertDto.alert_type_id ? BigInt(updateAlertDto.alert_type_id) : undefined,
      dive_type_id: updateAlertDto.dive_type_id ? BigInt(updateAlertDto.dive_type_id) : undefined,
    };

    return await this.prisma.alerts.update({
      where: { id: BigInt(id) },
      data,
    });
  }

  async remove(id: number) {
    const alert = await this.prisma.alerts.findUnique({
      where: { id: BigInt(id) },
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    return await this.prisma.alerts.delete({
      where: { id: BigInt(id) },
    });
  }

  async toggleActive(id: number) {
    const alert = await this.prisma.alerts.findUnique({
      where: { id: BigInt(id) },
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    return await this.prisma.alerts.update({
      where: { id: BigInt(id) },
      data: { active: !alert.active },
    });
  }
}
