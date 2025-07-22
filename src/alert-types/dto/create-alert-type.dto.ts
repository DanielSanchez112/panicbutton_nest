import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateAlertTypeDto {
  @ApiProperty({
    example: 'Emergency',
    description: 'Alert type name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Emergency alert for immediate assistance',
    description: 'Alert type description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
