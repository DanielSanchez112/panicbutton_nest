import { ApiProperty } from '@nestjs/swagger';

export class AlertType {
  @ApiProperty({
    example: 1,
    description: 'Alert type unique identifier',
  })
  id: bigint;

  @ApiProperty({
    example: 'Emergency',
    description: 'Alert type name',
  })
  name: string;

  @ApiProperty({
    example: 'Emergency alert for immediate assistance',
    description: 'Alert type description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Alert type creation timestamp',
  })
  created_at: Date;
}
