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
import { ProfileEntity } from './entities/profile.entity';
import { ProfileRepository } from './repositories/profile.repository';
import { ProfileService } from './services/profile.service';
import { UploadModule } from 'src/shared/uploads/uploads.module';

@Module({
  controllers: [],
  providers: [
    UserRepository,
    RoleRepository,
    PermissionRepository,
    RolePermissionRepository,
    ProfileRepository,

    UserService,
    RoleService,
    PermissionService,
    RolePermissionService,
    ProfileService,
  ],
  exports: [
    UserService,
    RoleService,
    PermissionService,
    ProfileService,

    UserRepository,
    RoleRepository,
    PermissionRepository,
    RolePermissionRepository,
    ProfileRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RoleEntity,
      PermissionEntity,
      RolePermissionEntity,
      ProfileEntity,
    ]),
    UploadModule,
  ],
})
export class UserManagementModule {}
