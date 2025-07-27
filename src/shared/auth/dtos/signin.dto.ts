import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';

export class SignInDto {
  @ApiProperty({
    type: String,
    example: faker.internet.email(),
  })
  usernameOrEmail: string;

  @ApiProperty({ type: String, example: 'password123' })
  password: string;
}
