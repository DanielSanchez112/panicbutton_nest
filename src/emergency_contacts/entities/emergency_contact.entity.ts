import { ApiProperty } from '@nestjs/swagger';

export class EmergencyContact {
  @ApiProperty({
    example: 1,
    description: 'Emergency contact unique identifier',
  })
  id: bigint;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Emergency contact creation timestamp',
  })
  created_at: Date;

  @ApiProperty({
    example: 1,
    description: 'User ID associated with this emergency contact',
    required: false,
  })
  user_id?: bigint;

  @ApiProperty({
    example: 'John',
    description: 'Contact first name',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Contact last name',
    required: false,
  })
  last_name?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Contact phone number',
    required: false,
  })
  phone_number?: string;

  @ApiProperty({
    example: 'Father',
    description: 'Relationship to the user',
    required: false,
  })
  relationship?: string;

  @ApiProperty({
    example: true,
    description: 'Contact active status',
    required: false,
  })
  active?: boolean;

  @ApiProperty({
    example: 1,
    description: 'Emergency contact ID from users table',
    required: false,
  })
  contact_id?: bigint;
}
