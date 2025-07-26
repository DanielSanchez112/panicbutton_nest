import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateDeviceTypeDto {
  @ApiProperty({
    example: 'Smartphone',
    description: 'Device type name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Mobile phone with panic button functionality',
    description: 'Device type description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
