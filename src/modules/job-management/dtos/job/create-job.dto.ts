import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { JobUploadEntity } from '../../entities/job-upload.entity';
import { JobStyle } from '../../enums/job-style.enum';

export class CreateJobDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(10, 255)
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  description: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ type: String })
  @IsString()
  currencyId: string;

  @ApiProperty({ type: [Number], description: 'IDs of job tags to attach' })
  @IsArray()
  @IsNumber({}, { each: true })
  tagIds: number[];

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  categoryId: number;

  @ApiProperty({ type: String, enum: JobStyle })
  @IsEnum(JobStyle)
  style: JobStyle;

  @ApiProperty({ isArray: true, description: 'ID of uploaded file' })
  @IsArray()
  uploads: Pick<JobUploadEntity, 'uploadId'>[];
}
