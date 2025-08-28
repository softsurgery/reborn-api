import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseFollowCountsDto {
  @ApiProperty({ type: Number })
  @Expose()
  followers?: number;

  @ApiProperty({ type: Number })
  @Expose()
  following?: number;
}
