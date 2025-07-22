import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    example: 1,
    description: 'User unique identifier',
  })
  id: bigint;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    required: false,
  })
  password?: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    required: false,
  })
  last_name?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'User phone number',
    required: false,
  })
  phone_number?: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'User creation timestamp',
  })
  created_at: Date;

  @ApiProperty({
    example: true,
    description: 'User active status',
    required: false,
  })
  active?: boolean;
}
