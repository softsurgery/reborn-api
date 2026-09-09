import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DailyActivityDto {
  @ApiProperty()
  @Expose()
  day: string;

  @ApiProperty()
  @Expose()
  date: string;

  @ApiProperty()
  @Expose()
  views: number;

  @ApiProperty()
  @Expose()
  apps: number;

  @ApiProperty()
  @Expose()
  height: string;
}
