import { Module } from '@nestjs/common';
import { BugController } from 'src/modules/system-reports/controllers/bug.controller';
import { FeedbackController } from 'src/modules/system-reports/controllers/feedback.controller';
import { SystemReportsModule } from 'src/modules/system-reports/system-reports.module';
import { AuthModule } from 'src/shared/auth/auth.module';
import { AuthController } from 'src/shared/auth/controllers/auth.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';

@Module({
  controllers: [AuthController, FeedbackController, BugController],
  providers: [],
  exports: [],
  imports: [
    AuthModule,
    LoggerModule,
    SystemReportsModule,
    UserManagementModule,
  ],
})
export class RoutesModule {}
