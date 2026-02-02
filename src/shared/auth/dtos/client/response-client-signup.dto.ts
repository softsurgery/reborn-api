import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseAbstractUserDto } from 'src/shared/abstract-user-management/dtos/abstract-user/response-abstract-user.dto';

export class ResponseClientSignupDto {
  @ApiProperty({ type: ResponseAbstractUserDto })
  @Expose()
  @Type(() => ResponseAbstractUserDto)
  user?: ResponseAbstractUserDto;
}
