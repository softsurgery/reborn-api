import { ApiProperty } from '@nestjs/swagger';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseRoleDto } from '../role/response-role.dto';
import { ResponsePermissionDto } from '../permission/response-permission.dto';
import { Expose, Type } from 'class-transformer';

export class ResponseRolePermissionDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  roleId: string;

  @ApiProperty({ type: () => ResponseRoleDto })
  @Expose()
  @Type(() => ResponseRoleDto)
  role?: ResponseRoleDto;

  @ApiProperty({ type: String })
  @Expose()
  permissionId: string;

  @ApiProperty({ type: () => ResponsePermissionDto })
  @Expose()
  @Type(() => ResponsePermissionDto)
  permission?: ResponsePermissionDto;
}
