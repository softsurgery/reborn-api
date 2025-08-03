import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { UpdateProfileDto } from '../profile/update-profile.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ type: String })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @ValidateIf((o) => o === undefined)
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  @ApiProperty({ type: UpdateProfileDto })
  @IsOptional()
  profile?: UpdateProfileDto;
}
