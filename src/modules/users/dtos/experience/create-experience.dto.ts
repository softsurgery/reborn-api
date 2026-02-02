import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(2, 50)
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
  @Length(2, 50)
  company?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description?: string;
}
