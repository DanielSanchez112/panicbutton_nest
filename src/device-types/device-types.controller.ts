import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DeviceTypesService } from './device-types.service';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { UpdateDeviceTypeDto } from './dto/update-device-type.dto';
import { DeviceType } from './entities/device-type.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('device-types')
@Public()
@Controller('device-types')
export class DeviceTypesController {
  constructor(private readonly deviceTypesService: DeviceTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new device type' })
  @ApiResponse({ status: 201, description: 'Device type created successfully', type: DeviceType })
  async create(@Body() createDeviceTypeDto: CreateDeviceTypeDto) {
    return await this.deviceTypesService.create(createDeviceTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all device types' })
  @ApiResponse({ status: 200, description: 'List of all device types', type: [DeviceType] })
  async findAll() {
    return await this.deviceTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get device type by ID' })
  @ApiParam({ name: 'id', description: 'Device type ID' })
  @ApiResponse({ status: 200, description: 'Device type found', type: DeviceType })
  @ApiResponse({ status: 404, description: 'Device type not found' })
  async findOne(@Param('id') id: string) {
    return await this.deviceTypesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update device type by ID' })
  @ApiParam({ name: 'id', description: 'Device type ID' })
  @ApiResponse({ status: 200, description: 'Device type updated successfully', type: DeviceType })
  @ApiResponse({ status: 404, description: 'Device type not found' })
  async update(@Param('id') id: string, @Body() updateDeviceTypeDto: UpdateDeviceTypeDto) {
    return await this.deviceTypesService.update(+id, updateDeviceTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete device type by ID' })
  @ApiParam({ name: 'id', description: 'Device type ID' })
  @ApiResponse({ status: 200, description: 'Device type deleted successfully' })
  @ApiResponse({ status: 404, description: 'Device type not found' })
  async remove(@Param('id') id: string) {
    return await this.deviceTypesService.remove(+id);
  }
}
