import { ApiProperty } from '@nestjs/swagger';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { Expose, Type } from 'class-transformer';
import { ResponseUserDto } from '../user/response-user.dto';

export class ResponseFollowDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  followerId: string;

  @ApiProperty({ type: () => ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  follower?: ResponseUserDto;

  @ApiProperty({ type: String })
  @Expose()
  followingId: string;

  @ApiProperty({ type: () => ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  following?: ResponseUserDto;
}
