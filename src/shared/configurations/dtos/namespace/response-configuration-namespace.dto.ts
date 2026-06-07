import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseConfigurationParamDto } from '../paramater/response-configuration-param.dto';
import { ResponseAbstractUserDto } from 'src/shared/abstract-user-management/dtos/abstract-user/response-abstract-user.dto';

export class ResponseConfigurationNamespaceDto extends ResponseDtoHelper {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  name?: string;

  @ApiProperty({ type: String })
  @Expose()
  description?: string;

  @ApiProperty({ type: () => [ResponseConfigurationParamDto] })
  @Expose()
  @Type(() => ResponseConfigurationParamDto)
  params?: ResponseConfigurationParamDto[];

  @ApiProperty({ type: String, example: '1' })
  @Expose()
  userId?: string;

  @ApiProperty({ type: ResponseAbstractUserDto })
  @Expose()
  @Type(() => ResponseAbstractUserDto)
  user: ResponseAbstractUserDto;
}
