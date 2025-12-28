import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ExperienceDto {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  company: string;

  @ApiProperty()
  @Expose()
  startDate: string;

  @ApiProperty()
  @Expose()
  endDate: string;

  @ApiProperty()
  @Expose()
  description: string;
}
