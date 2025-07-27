import { ApiProperty } from '@nestjs/swagger';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { RolePermissionEntity } from '../../entities/role-permission.entity';
import { Expose, Type } from 'class-transformer';

export class ResponsePermissionDto extends ResponseDtoHelper {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  label: string;

  @ApiProperty({ type: String })
  @Expose()
  description?: string;

  @ApiProperty({ type: () => [RolePermissionEntity] })
  @Expose()
  @Type(() => RolePermissionEntity)
  roles: RolePermissionEntity[];
}
