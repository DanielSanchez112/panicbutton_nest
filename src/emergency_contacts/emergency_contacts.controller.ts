import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EmergencyContactsService } from './emergency_contacts.service';
import { CreateEmergencyContactDto } from './dto/create-emergency_contact.dto';
import { UpdateEmergencyContactDto } from './dto/update-emergency_contact.dto';
import { EmergencyContact } from './entities/emergency_contact.entity';

@ApiTags('emergency-contacts')
@Controller('emergency-contacts')
export class EmergencyContactsController {
  constructor(private readonly emergencyContactsService: EmergencyContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new emergency contact' })
  @ApiResponse({ status: 201, description: 'Emergency contact created successfully', type: EmergencyContact })
  async create(@Body() createEmergencyContactDto: CreateEmergencyContactDto) {
    return await this.emergencyContactsService.create(createEmergencyContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all emergency contacts' })
  @ApiResponse({ status: 200, description: 'List of all emergency contacts', type: [EmergencyContact] })
  async findAll() {
    return await this.emergencyContactsService.findAll();
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get emergency contacts by user ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of emergency contacts for user', type: [EmergencyContact] })
  async findByUserId(@Param('id') id: string) {
    return await this.emergencyContactsService.findByUserId(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get emergency contact by ID' })
  @ApiParam({ name: 'id', description: 'Emergency contact ID' })
  @ApiResponse({ status: 200, description: 'Emergency contact found', type: EmergencyContact })
  @ApiResponse({ status: 404, description: 'Emergency contact not found' })
  async findOne(@Param('id') id: string) {
    return await this.emergencyContactsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update emergency contact by ID' })
  @ApiParam({ name: 'id', description: 'Emergency contact ID' })
  @ApiResponse({ status: 200, description: 'Emergency contact updated successfully', type: EmergencyContact })
  @ApiResponse({ status: 404, description: 'Emergency contact not found' })
  async update(@Param('id') id: string, @Body() updateEmergencyContactDto: UpdateEmergencyContactDto) {
    return await this.emergencyContactsService.update(+id, updateEmergencyContactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete emergency contact by ID' })
  @ApiParam({ name: 'id', description: 'Emergency contact ID' })
  @ApiResponse({ status: 200, description: 'Emergency contact deleted successfully' })
  @ApiResponse({ status: 404, description: 'Emergency contact not found' })
  async remove(@Param('id') id: string) {
    return await this.emergencyContactsService.remove(+id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle emergency contact active status' })
  @ApiParam({ name: 'id', description: 'Emergency contact ID' })
  @ApiResponse({ status: 200, description: 'Emergency contact active status toggled successfully', type: EmergencyContact })
  @ApiResponse({ status: 404, description: 'Emergency contact not found' })
  async toggleActive(@Param('id') id: string) {
    return await this.emergencyContactsService.toggleActive(+id);
  }
}
