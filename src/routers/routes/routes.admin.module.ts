import { Module } from '@nestjs/common';
import { PermissionController } from 'src/modules/user-management/controllers/permission.controller';
import { RoleController } from 'src/modules/user-management/controllers/role.controller';
import { UserController } from 'src/modules/user-management/controllers/user.controller';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { LoggerController } from 'src/shared/logger/controller/logger.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';

@Module({
  controllers: [
    UserController,
    RoleController,
    PermissionController,
    LoggerController,
  ],
  providers: [],
  exports: [],
  imports: [UserManagementModule, LoggerModule],
})
export class RoutesAdminModule {}
