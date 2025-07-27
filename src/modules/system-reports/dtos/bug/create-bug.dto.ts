import { ApiProperty } from '@nestjs/swagger';
import { BugVariant } from '../../enums/bug-variant.enum';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CreateDeviceInfoDto } from '../device-info/create-device-info.dto';

export class CreateBugDto {
  @ApiProperty({ type: String, enum: BugVariant })
  @IsEnum(BugVariant)
  variant: BugVariant;

  @ApiProperty({ type: String })
  @IsString()
  @Length(10, 255)
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  @Length(10, 1024)
  description: string;

  @ApiProperty({ type: CreateDeviceInfoDto })
  @IsObject()
  @IsOptional()
  device?: CreateDeviceInfoDto;
}
