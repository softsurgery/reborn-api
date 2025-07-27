import { ApiProperty } from '@nestjs/swagger';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseRolePermissionDto } from '../role-permission/response-role-permission.dto';
import { ResponseUserDto } from '../user/response-user.dto';
import { Expose, Type } from 'class-transformer';

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

  @ApiProperty({ type: () => [ResponseUserDto] })
  @Expose()
  @Type(() => ResponseUserDto)
  users?: ResponseUserDto[];
}
