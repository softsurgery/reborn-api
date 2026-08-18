import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { WorkTypes } from '../../enums/experience.work-type.enum';
import { LocationTypes } from '../../enums/experience.location-type.enum';

export class CreateExperienceDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(2, 255)
  title?: string;

  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ type: String })
  @IsString()
  @Length(2, 255)
  company?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty()
  @IsEnum(WorkTypes)
  workType?: WorkTypes;

  @ApiProperty()
  @IsEnum(LocationTypes)
  locationType?: LocationTypes;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description?: string;
}
