import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { Alert } from './entities/alert.entity';

@ApiTags('alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new alert' })
  @ApiResponse({ status: 201, description: 'Alert created successfully', type: Alert })
  async create(@Body() createAlertDto: CreateAlertDto) {
    return await this.alertsService.create(createAlertDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all alerts' })
  @ApiResponse({ status: 200, description: 'List of all alerts', type: [Alert] })
  async findAll() {
    return await this.alertsService.findAll();
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get alerts by user ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of alerts for user', type: [Alert] })
  async findByUserId(@Param('id') id: string) {
    return await this.alertsService.findByUserId(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get alert by ID' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert found', type: Alert })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async findOne(@Param('id') id: string) {
    return await this.alertsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update alert by ID' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert updated successfully', type: Alert })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async update(@Param('id') id: string, @Body() updateAlertDto: UpdateAlertDto) {
    return await this.alertsService.update(+id, updateAlertDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete alert by ID' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert deleted successfully' })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async remove(@Param('id') id: string) {
    return await this.alertsService.remove(+id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle alert active status' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert active status toggled successfully', type: Alert })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async toggleActive(@Param('id') id: string) {
    return await this.alertsService.toggleActive(+id);
  }
}
