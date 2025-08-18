import { Module } from '@nestjs/common';
import { DeviceInfoController } from 'src/modules/system-reports/controllers/device-info.controller';
import { SystemReportsModule } from 'src/modules/system-reports/system-reports.module';
import { PermissionController } from 'src/modules/user-management/controllers/permission.controller';
import { RoleController } from 'src/modules/user-management/controllers/role.controller';
import { UserController } from 'src/modules/user-management/controllers/user.controller';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { LoggerController } from 'src/shared/logger/controller/logger.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { StoreController } from 'src/shared/store/controllers/store.controller';
import { StoreModule } from 'src/shared/store/store.module';

@Module({
  controllers: [
    UserController,
    RoleController,
    PermissionController,
    LoggerController,
    DeviceInfoController,
    StoreController,
  ],
  providers: [],
  exports: [],
  imports: [
    UserManagementModule,
    LoggerModule,
    SystemReportsModule,
    StoreModule,
  ],
})
export class RoutesAdminModule {}
