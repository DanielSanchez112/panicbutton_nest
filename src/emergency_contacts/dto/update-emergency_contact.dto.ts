import { PartialType } from '@nestjs/swagger';
import { CreateEmergencyContactDto } from './create-emergency_contact.dto';

export class UpdateEmergencyContactDto extends PartialType(CreateEmergencyContactDto) {}
