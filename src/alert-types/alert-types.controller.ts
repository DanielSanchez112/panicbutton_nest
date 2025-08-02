import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AlertTypesService } from './alert-types.service';
import { CreateAlertTypeDto } from './dto/create-alert-type.dto';
import { UpdateAlertTypeDto } from './dto/update-alert-type.dto';
import { AlertType } from './entities/alert-type.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('alert-types')
@Public()
@Controller('alert-types')
export class AlertTypesController {
  constructor(private readonly alertTypesService: AlertTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new alert type' })
  @ApiResponse({ status: 201, description: 'Alert type created successfully', type: AlertType })
  async create(@Body() createAlertTypeDto: CreateAlertTypeDto) {
    return await this.alertTypesService.create(createAlertTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all alert types' })
  @ApiResponse({ status: 200, description: 'List of all alert types', type: [AlertType] })
  async findAll() {
    return await this.alertTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get alert type by ID' })
  @ApiParam({ name: 'id', description: 'Alert type ID' })
  @ApiResponse({ status: 200, description: 'Alert type found', type: AlertType })
  @ApiResponse({ status: 404, description: 'Alert type not found' })
  async findOne(@Param('id') id: string) {
    return await this.alertTypesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update alert type by ID' })
  @ApiParam({ name: 'id', description: 'Alert type ID' })
  @ApiResponse({ status: 200, description: 'Alert type updated successfully', type: AlertType })
  @ApiResponse({ status: 404, description: 'Alert type not found' })
  async update(@Param('id') id: string, @Body() updateAlertTypeDto: UpdateAlertTypeDto) {
    return await this.alertTypesService.update(+id, updateAlertTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete alert type by ID' })
  @ApiParam({ name: 'id', description: 'Alert type ID' })
  @ApiResponse({ status: 200, description: 'Alert type deleted successfully' })
  @ApiResponse({ status: 404, description: 'Alert type not found' })
  async remove(@Param('id') id: string) {
    return await this.alertTypesService.remove(+id);
  }
}
