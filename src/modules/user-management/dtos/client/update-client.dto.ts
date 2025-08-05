import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { UpdateProfileDto } from '../profile/update-profile.dto';
import { Type } from 'class-transformer';

export class UpdateClientDto {
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

  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiProperty({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: UpdateProfileDto })
  @IsOptional()
  @Type(() => UpdateProfileDto)
  profile?: UpdateProfileDto;
}
