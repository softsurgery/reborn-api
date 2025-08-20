import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { RolePermissionEntity } from '../../entities/role-permission.entity';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  declare permissions: Pick<RolePermissionEntity, 'id' | 'permissionId'>[];
}
