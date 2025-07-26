import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateAlertDto {
  @ApiProperty({
    example: 1,
    description: 'User ID who triggered the alert',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Emergency contact ID to notify',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  contact_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Alert type ID',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  alert_type_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Device type ID',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  dive_type_id?: number;

  @ApiProperty({
    example: 40.7128,
    description: 'Latitude of the alert location',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  location_lat?: number;

  @ApiProperty({
    example: -74.0060,
    description: 'Longitude of the alert location',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  location_lng?: number;

  @ApiProperty({
    example: false,
    description: 'Whether message was sent',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  message_sent?: boolean;

  @ApiProperty({
    example: true,
    description: 'Alert active status',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether call was made',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  call_made?: boolean;
}
