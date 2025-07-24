import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlertDto: CreateAlertDto) {
    const data = await this.prisma.alerts.create({
      data: createAlertDto 
    })

    return data
  }

  async findAll() {
    const data = await this.prisma.alerts.findMany({
      where: { active: true }
    })
    return data
  }

  async findByUserId(id: number) {
    const alerts = await this.prisma.alerts.findMany({
      where: { user_id: BigInt(id), active: true },
      include: {
        users: true,
        emergency_contacts: true,
      }
    })
    if (alerts.length === 0) {
      throw new NotFoundException(`No active alerts found for user ID ${id}`);
    }
    return alerts;
  }

  async findOne(id: number) {
    const alert = await this.prisma.alerts.findUnique({
      where: { id: BigInt(id), active: true },
      include:{
        users: true,
        emergency_contacts: true
      }
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    return alert;
  }

  async update(id: number, updateAlertDto: UpdateAlertDto) {
    const alert = await this.prisma.alerts.findUnique({
      where: { id: BigInt(id), active: true },
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    return await this.prisma.alerts.update({
      where: { id: BigInt(id) },
      data: updateAlertDto,
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
