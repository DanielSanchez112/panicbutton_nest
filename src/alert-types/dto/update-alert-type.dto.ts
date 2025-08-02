import { PartialType } from '@nestjs/swagger';
import { CreateAlertTypeDto } from './create-alert-type.dto';

export class UpdateAlertTypeDto extends PartialType(CreateAlertTypeDto) {}
