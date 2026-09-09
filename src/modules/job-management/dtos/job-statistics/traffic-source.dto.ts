import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TrafficSourceDto {
  @ApiProperty()
  @Expose()
  source: string;

  @ApiProperty()
  @Expose()
  percent: string;

  @ApiProperty()
  @Expose()
  count: string;
}
