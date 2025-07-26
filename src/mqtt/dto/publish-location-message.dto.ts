import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class PublishLocationMessageDto {
  @ApiProperty({
    description: 'Tópico MQTT donde publicar el mensaje',
    example: 'panicbutton/1/alerts/test'
  })
  @IsString()
  topic: string;

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
    description: 'Mensaje adicional opcional',
    example: 'Ubicación de prueba desde Swagger',
    required: false
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: 'Precisión de la ubicación en metros',
    example: 10,
    required: false
  })
  @IsOptional()
  @IsNumber()
  accuracy?: number;

  @ApiProperty({
    description: 'Nivel de calidad de servicio (QoS)',
    example: 1,
    enum: [0, 1, 2],
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  qos?: 0 | 1 | 2;

  @ApiProperty({
    description: 'Si el mensaje debe ser retenido por el broker',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  retain?: boolean;
}
