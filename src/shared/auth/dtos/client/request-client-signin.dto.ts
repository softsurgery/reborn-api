import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';

export class RequestClientSignInDto {
  @ApiProperty({
    type: String,
    example: faker.internet.email(),
  })
  email: string;

  @ApiProperty({ type: String, example: 'password123' })
  password: string;
}
