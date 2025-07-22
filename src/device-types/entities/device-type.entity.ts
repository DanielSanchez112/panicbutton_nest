import { ApiProperty } from '@nestjs/swagger';

export class DeviceType {
  @ApiProperty({
    example: 1,
    description: 'Device type unique identifier',
  })
  id: bigint;

  @ApiProperty({
    example: 'Smartphone',
    description: 'Device type name',
  })
  name: string;

  @ApiProperty({
    example: 'Mobile phone with panic button functionality',
    description: 'Device type description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Device type creation timestamp',
  })
  created_at: Date;
}
