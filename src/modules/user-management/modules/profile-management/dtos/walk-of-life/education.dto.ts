import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class EducationDto {
  @ApiProperty()
  @Expose()
  school: string;

  @ApiProperty()
  @Expose()
  degree: string;

  @ApiProperty()
  @Expose()
  startYear: number;

  @ApiProperty()
  @Expose()
  endYear: number;
}
