import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class PublishAlertDto {
  @ApiProperty({
    description: 'ID del usuario que envía la alerta',
    example: 1
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'Latitud de la ubicación',
    example: -34.6037
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'Longitud de la ubicación',
    example: -58.3816
  })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    description: 'Precisión de la ubicación en metros',
    example: 10,
    required: false
  })
  @IsOptional()
  @IsNumber()
  accuracy?: number;

  @ApiProperty({
    description: 'Tipo de alerta',
    example: 'panic_button',
    required: false
  })
  @IsOptional()
  @IsString()
  alert_type?: string;

  @ApiProperty({
    description: 'Prioridad de la alerta',
    example: 'HIGH',
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: false
  })
  @IsOptional()
  @IsString()
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
