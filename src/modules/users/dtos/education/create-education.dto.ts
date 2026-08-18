import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(2, 255)
  title?: string;

  @ApiProperty({ type: Date })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ type: Date })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ type: String })
  @IsString()
  @Length(2, 255)
  institution?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description?: string;
}
