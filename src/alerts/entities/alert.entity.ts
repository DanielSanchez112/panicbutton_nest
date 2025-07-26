import { ApiProperty } from '@nestjs/swagger';

export class Alert {
  @ApiProperty({
    example: 1,
    description: 'Alert unique identifier',
  })
  id: bigint;

  @ApiProperty({
    example: 1,
    description: 'User ID who triggered the alert',
    required: false,
  })
  user_id?: bigint;

  @ApiProperty({
    example: 1,
    description: 'Emergency contact ID to notify',
    required: false,
  })
  contact_id?: bigint;

  @ApiProperty({
    example: 1,
    description: 'Alert type ID',
    required: false,
  })
  alert_type_id?: bigint;

  @ApiProperty({
    example: 1,
    description: 'Device type ID',
    required: false,
  })
  dive_type_id?: bigint;

  @ApiProperty({
    example: 40.7128,
    description: 'Latitude of the alert location',
    required: false,
  })
  location_lat?: number;

  @ApiProperty({
    example: -74.0060,
    description: 'Longitude of the alert location',
    required: false,
  })
  location_lng?: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Alert creation timestamp',
  })
  created_at: Date;

  @ApiProperty({
    example: false,
    description: 'Whether message was sent',
    required: false,
  })
  message_sent?: boolean;

  @ApiProperty({
    example: true,
    description: 'Alert active status',
    required: false,
  })
  active?: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether call was made',
    required: false,
  })
  call_made?: boolean;
}
