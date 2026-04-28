import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { JobUploadEntity } from '../../entities/job-upload.entity';
import { JobStyle } from '../../enums/job-style.enum';
import { JobDifficulty } from '../../enums/job-difficulty.enum';
import { JobPricingType } from '../../enums/job-pricing-type.enum';

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

  @ApiProperty({ type: String, enum: JobPricingType })
  @IsEnum(JobPricingType)
  @IsOptional()
  pricingType?: JobPricingType;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  currencyId?: number;

  @ApiProperty({ type: [Number], description: 'IDs of job tags to attach' })
  @IsArray()
  @IsNumber({}, { each: true })
  tagIds: number[];

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  categoryId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  longitude: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  latitude: number;

  @ApiProperty({ type: String, enum: JobStyle })
  @IsEnum(JobStyle)
  style: JobStyle;

  @ApiProperty({ type: String, enum: JobDifficulty })
  @IsEnum(JobDifficulty)
  difficulty: JobDifficulty;

  @ApiProperty({ isArray: true, description: 'ID of uploaded file' })
  @IsArray()
  uploads: Pick<JobUploadEntity, 'uploadId'>[];
}
