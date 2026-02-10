import { Injectable } from '@nestjs/common';
import { RolePermissionRepository } from '../repositories/role-permission.repository';
import { RolePermissionEntity } from '../entities/role-permission.entity';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export class RolePermissionService extends AbstractCrudService<RolePermissionEntity> {
  constructor(
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {
    super(rolePermissionRepository);
  }
}
