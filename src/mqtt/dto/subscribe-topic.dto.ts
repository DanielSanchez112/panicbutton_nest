import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class SubscribeTopicDto {
  @ApiProperty({
    description: 'Tópico MQTT al cual suscribirse',
    example: 'panicbutton/alerts/+'
  })
  @IsString()
  topic: string;

  @ApiProperty({
    description: 'Nivel de calidad de servicio (QoS) para la suscripción',
    example: 1,
    enum: [0, 1, 2],
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  qos?: 0 | 1 | 2;
}
