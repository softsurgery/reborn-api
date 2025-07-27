import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';

export class SignUpDto {
  @ApiProperty({ type: String, example: faker.internet.email() })
  email: string;

  @ApiProperty({ type: String, example: faker.internet.username() })
  username: string;

  @ApiProperty({ type: String, example: 'password123' })
  password: string;
}
