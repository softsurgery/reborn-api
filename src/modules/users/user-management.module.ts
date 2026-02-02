import { Module } from '@nestjs/common';
import { PermissionService } from 'src/shared/abstract-user-management/services/permission.service';
import { RolePermissionService } from 'src/shared/abstract-user-management/services/role-permission.service';
import { RoleService } from 'src/shared/abstract-user-management/services/role.service';
import { RoleRepository } from 'src/shared/abstract-user-management/repositories/role.repository';
import { PermissionRepository } from 'src/shared/abstract-user-management/repositories/permission.repository';
import { RolePermissionRepository } from 'src/shared/abstract-user-management/repositories/role-permission.repository';
import { FollowRepository } from 'src/modules/users/repositories/follow.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from 'src/shared/abstract-user-management/entities/role.entity';
import { PermissionEntity } from 'src/shared/abstract-user-management/entities/permission.entity';
import { RolePermissionEntity } from 'src/shared/abstract-user-management/entities/role-permission.entity';
import { UserUploadEntity } from './entities/user-upload.entity';
import { UserEntity } from './entities/user.entity';
import { FollowEntity } from 'src/modules/users/entities/follow.entity';
import { ReferenceTypesModule } from 'src/shared/reference-types/reference-types.module';
import { StorageModule } from 'src/shared/storage/storage.module';
import { UserService } from './services/user.service';
import { UserUploadService } from './services/user-upload.service';
import { FollowService } from '../../shared/abstract-user-management/services/follow.service';
import { ExperienceService } from './services/experience.service';
import { EducationService } from './services/education.service';
import { UserRepository } from './repositories/user.repository';
import { UserUploadRepository } from './repositories/user-upload.repository';
import { ExperienceRepository } from './repositories/experience.repository';
import { EducationRepository } from './repositories/education.repository';
import { ExperienceEntity } from './entities/experience.entity';
import { EducationEntity } from './entities/education.entity';

@Module({
  controllers: [],
  providers: [
    //services
    UserService,
    UserUploadService,

    RoleService,
    PermissionService,
    RolePermissionService,

    FollowService,
    ExperienceService,
    EducationService,

    //repositories
    UserRepository,
    UserUploadRepository,

    RoleRepository,
    PermissionRepository,
    RolePermissionRepository,

    FollowRepository,
    ExperienceRepository,
    EducationRepository,
  ],
  exports: [
    //services
    UserService,
    UserUploadService,

    RoleService,
    PermissionService,
    RolePermissionService,

    FollowService,
    ExperienceService,
    EducationService,

    //repositories
    UserRepository,
    UserUploadRepository,

    RoleRepository,
    PermissionRepository,
    RolePermissionRepository,

    FollowRepository,
    ExperienceRepository,
    EducationRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserUploadEntity,
      RoleEntity,
      PermissionEntity,
      RolePermissionEntity,
      FollowEntity,
      ExperienceEntity,
      EducationEntity,
    ]),
    StorageModule,
    ReferenceTypesModule,
  ],
})
export class UserManagementModule {}
