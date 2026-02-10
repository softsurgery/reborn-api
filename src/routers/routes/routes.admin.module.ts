import { Module } from '@nestjs/common';
import { DeviceInfoController } from 'src/modules/system-reports/controllers/device-info.controller';
import { SystemReportsModule } from 'src/modules/system-reports/system-reports.module';
import { UserController } from 'src/modules/users/controllers/user.controller';
import { UserManagementModule } from 'src/modules/users/user-management.module';
import { PermissionController } from 'src/shared/abstract-user-management/controllers/permission.controller';
import { RoleController } from 'src/shared/abstract-user-management/controllers/role.controller';
import { LoggerController } from 'src/shared/logger/controller/logger.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';

@Module({
  controllers: [
    UserController,
    RoleController,
    PermissionController,
    LoggerController,
    DeviceInfoController,
  ],
  providers: [],
  exports: [],
  imports: [UserManagementModule, LoggerModule, SystemReportsModule],
})
export class RoutesAdminModule {}
