import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  // No additional properties needed for update, as it extends CreatePermissionDto
  // This allows us to use the same validation rules for updating a permission
}
