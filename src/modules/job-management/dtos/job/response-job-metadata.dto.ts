import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseJobMetadataDto {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: Number })
  @Expose()
  requestCount: number;

  @ApiProperty({ type: Boolean })
  @Expose()
  paymentVerified: boolean;

  @ApiProperty({ type: Number })
  @Expose()
  reviewCount: number;

  @ApiProperty({ type: Number })
  @Expose()
  rating: number;

  @ApiProperty({ type: Number })
  @Expose()
  hireRate: number;
}
