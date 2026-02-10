import { ApiProperty } from '@nestjs/swagger';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseRolePermissionDto } from '../role-permission/response-role-permission.dto';
import { Expose, Type } from 'class-transformer';
import { ResponseAbstractUserDto } from '../abstract-user/response-abstract-user.dto';

export class ResponseRoleDto extends ResponseDtoHelper {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  label: string;

  @ApiProperty({ type: String })
  @Expose()
  description?: string;

  @ApiProperty({ type: () => [ResponseRolePermissionDto] })
  @Expose()
  @Type(() => ResponseRolePermissionDto)
  permissions?: ResponseRolePermissionDto[];

  @ApiProperty({ type: () => [ResponseAbstractUserDto] })
  @Expose()
  @Type(() => ResponseAbstractUserDto)
  users?: ResponseAbstractUserDto[];
}
