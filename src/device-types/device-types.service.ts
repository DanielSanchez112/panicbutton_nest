import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { UpdateDeviceTypeDto } from './dto/update-device-type.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DeviceTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDeviceTypeDto: CreateDeviceTypeDto) {
    return await this.prisma.device_types.create({
      data: createDeviceTypeDto,
    });
  }

  async findAll() {
    return await this.prisma.device_types.findMany({
      include: {
        alerts: true,
      },
    });
  }

  async findOne(id: number) {
    const deviceType = await this.prisma.device_types.findUnique({
      where: { id: BigInt(id) },
      include: {
        alerts: true,
      },
    });

    if (!deviceType) {
      throw new NotFoundException(`Device type with ID ${id} not found`);
    }

    return deviceType;
  }

  async update(id: number, updateDeviceTypeDto: UpdateDeviceTypeDto) {
    const deviceType = await this.prisma.device_types.findUnique({
      where: { id: BigInt(id) },
    });

    if (!deviceType) {
      throw new NotFoundException(`Device type with ID ${id} not found`);
    }

    return await this.prisma.device_types.update({
      where: { id: BigInt(id) },
      data: updateDeviceTypeDto,
    });
  }

  async remove(id: number) {
    const deviceType = await this.prisma.device_types.findUnique({
      where: { id: BigInt(id) },
    });

    if (!deviceType) {
      throw new NotFoundException(`Device type with ID ${id} not found`);
    }

    return await this.prisma.device_types.delete({
      where: { id: BigInt(id) },
    });
  }
}
