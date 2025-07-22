import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateEmergencyContactDto {
  @ApiProperty({
    example: 1,
    description: 'User ID associated with this emergency contact',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @ApiProperty({
    example: 'John',
    description: 'Contact first name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Contact last name',
    required: false,
  })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Contact phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({
    example: 'Father',
    description: 'Relationship to the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiProperty({
    example: true,
    description: 'Contact active status',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
