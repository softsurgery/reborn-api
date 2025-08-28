import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseIsFollowingDto {
  @ApiProperty({ type: String })
  @Expose()
  userId?: string;

  @ApiProperty({ type: String })
  @Expose()
  targetId?: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  isFollowing?: boolean;
}
