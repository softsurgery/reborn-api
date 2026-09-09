import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ExperienceDistributionDto {
  @ApiProperty()
  @Expose()
  level: string;

  @ApiProperty()
  @Expose()
  percent: number;

  @ApiProperty()
  @Expose()
  color: string;
}
