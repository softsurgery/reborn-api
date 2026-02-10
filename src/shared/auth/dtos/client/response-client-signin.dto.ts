import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseAbstractUserDto } from 'src/shared/abstract-user-management/dtos/abstract-user/response-abstract-user.dto';

export class ResponseClientSigninDto {
  @ApiProperty({ type: ResponseAbstractUserDto })
  @Expose()
  @Type(() => ResponseAbstractUserDto)
  user: ResponseAbstractUserDto;

  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token: string;
}
