import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseUserDto } from 'src/modules/user-management/dtos/user/response-user.dto';

export class ResponseSignupDto {
  @ApiProperty({ type: ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  user: ResponseUserDto;
}
