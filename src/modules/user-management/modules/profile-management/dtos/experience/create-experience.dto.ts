import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({ type: String })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  company: string;

  @ApiProperty()
  @IsString()
  startDate: string;

  @ApiProperty()
  @IsString()
  endDate: string;

  @ApiProperty()
  @IsString()
  description: string;
}
