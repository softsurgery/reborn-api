import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CreateDeviceInfoDto } from '../device-info/create-device-info.dto';
import { FeedbackCategory } from '../../enums/feedback-category.enum';

export class CreateFeedbackDto {
  @ApiProperty({ type: String, enum: FeedbackCategory })
  @IsEnum(FeedbackCategory)
  category: FeedbackCategory;

  @ApiProperty({ type: String })
  @IsString()
  @Length(10, 1024)
  message: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  rating?: number;

  @ApiProperty({ type: CreateDeviceInfoDto })
  @IsObject()
  @IsOptional()
  device?: CreateDeviceInfoDto;
}
