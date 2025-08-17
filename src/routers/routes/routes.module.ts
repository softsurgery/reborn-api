import { Module } from '@nestjs/common';
import { BugController } from 'src/modules/system-reports/controllers/bug.controller';
import { FeedbackController } from 'src/modules/system-reports/controllers/feedback.controller';
import { SystemReportsModule } from 'src/modules/system-reports/system-reports.module';
import { AuthModule } from 'src/shared/auth/auth.module';
import { AuthController } from 'src/shared/auth/controllers/auth.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { ClientAuthController } from 'src/shared/auth/controllers/client-auth.controller';
import { UploadController } from 'src/shared/uploads/controllers/upload.controller';
import { UploadModule } from 'src/shared/uploads/uploads.module';
import { ClientController } from 'src/modules/user-management/controllers/client.controller';
import { JobController } from 'src/modules/job-management/controllers/job.controller';
import { JobManagementModule } from 'src/modules/job-management/job-management.module';

@Module({
  controllers: [
    AuthController,
    ClientAuthController,
    ClientController,
    FeedbackController,
    BugController,
    UploadController,
    JobController,
  ],
  providers: [],
  exports: [],
  imports: [
    AuthModule,
    LoggerModule,
    SystemReportsModule,
    UserManagementModule,
    UploadModule,
    JobManagementModule,
  ],
})
export class RoutesModule {}
