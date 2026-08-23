import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseUserBlockDto {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  userId: string;

  @ApiProperty({ type: String })
  @Expose()
  blockedUserId: string;
}
