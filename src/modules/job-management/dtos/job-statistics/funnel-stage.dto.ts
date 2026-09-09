import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FunnelStageDto {
  @ApiProperty()
  @Expose()
  label: string;

  @ApiProperty()
  @Expose()
  value: string;

  @ApiProperty()
  @Expose()
  percent: number;

  @ApiProperty()
  @Expose()
  color: string;
}
