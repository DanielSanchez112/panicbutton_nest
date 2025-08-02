import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlertTypeDto } from './dto/create-alert-type.dto';
import { UpdateAlertTypeDto } from './dto/update-alert-type.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AlertTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlertTypeDto: CreateAlertTypeDto) {
    return await this.prisma.alert_types.create({
      data: createAlertTypeDto,
    });
  }

  async findAll() {
    return await this.prisma.alert_types.findMany({
      include: {
        alerts: true,
      },
    });
  }

  async findOne(id: number) {
    const alertType = await this.prisma.alert_types.findUnique({
      where: { id: BigInt(id) },
      include: {
        alerts: true,
      },
    });

    if (!alertType) {
      throw new NotFoundException(`Alert type with ID ${id} not found`);
    }

    return alertType;
  }

  async update(id: number, updateAlertTypeDto: UpdateAlertTypeDto) {
    const alertType = await this.prisma.alert_types.findUnique({
      where: { id: BigInt(id) },
    });

    if (!alertType) {
      throw new NotFoundException(`Alert type with ID ${id} not found`);
    }

    return await this.prisma.alert_types.update({
      where: { id: BigInt(id) },
      data: updateAlertTypeDto,
    });
  }

  async remove(id: number) {
    const alertType = await this.prisma.alert_types.findUnique({
      where: { id: BigInt(id) },
    });

    if (!alertType) {
      throw new NotFoundException(`Alert type with ID ${id} not found`);
    }

    return await this.prisma.alert_types.delete({
      where: { id: BigInt(id) },
    });
  }
}
