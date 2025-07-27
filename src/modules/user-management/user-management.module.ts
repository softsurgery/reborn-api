import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { RoleRepository } from './repositories/role.repository';
import { PermissionRepository } from './repositories/permission.repository';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';
import { RolePermissionRepository } from './repositories/role-permission.repository';
import { RolePermissionService } from './services/role-permission.service';
import { RolePermissionEntity } from './entities/role-permission.entity';

@Module({
  controllers: [],
  providers: [
    UserRepository,
    RoleRepository,
    PermissionRepository,
    RolePermissionRepository,

    UserService,
    RoleService,
    PermissionService,
    RolePermissionService,
  ],
  exports: [
    UserService,
    RoleService,
    PermissionService,

    UserRepository,
    RoleRepository,
    PermissionRepository,
    RolePermissionRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RoleEntity,
      PermissionEntity,
      RolePermissionEntity,
    ]),
  ],
})
export class UserManagementModule {}
