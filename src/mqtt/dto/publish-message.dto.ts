import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class PublishMessageDto {
  @ApiProperty({
    description: 'Tópico MQTT donde publicar el mensaje',
    example: 'panicbutton/1/alerts/test'
  })
  @IsString()
  topic: string;

  @ApiProperty({
    description: 'Contenido del mensaje a publicar. Puede ser texto plano o JSON stringificado',
    example: '{"latitude": -34.6037, "longitude": -58.3816, "message": "Ubicación de prueba"}',
    type: 'string'
  })
  @IsString()
  payload: string;

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
