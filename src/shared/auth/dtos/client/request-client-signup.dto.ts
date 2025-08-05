import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class RequestClientSignUpDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(3, 50)
  @IsOptional()
  firstName?: string;

  @ApiProperty({ type: String })
  @IsString()
  @Length(3, 50)
  @IsOptional()
  lastName?: string;

  @ApiProperty({ type: String, example: faker.internet.email() })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: faker.internet.username() })
  @IsString()
  @Length(3, 50)
  username: string;

  @ApiProperty({ type: String, example: 'super-secret-password' })
  @IsString()
  @MinLength(6)
  password: string;
}
