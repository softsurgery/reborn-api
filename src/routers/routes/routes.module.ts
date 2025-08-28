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
import { JobTagController } from 'src/modules/job-management/controllers/job-tag.controller';
import { StoreController } from 'src/shared/store/controllers/store.controller';
import { StoreModule } from 'src/shared/store/store.module';
import { JobCategoryController } from 'src/modules/job-management/controllers/job-category.controller';
import { FollowController } from 'src/modules/user-management/controllers/follow.controller';

@Module({
  controllers: [
    //auth
    AuthController,
    ClientAuthController,
    //common
    UploadController,
    StoreController,
    //user
    ClientController,
    FollowController,
    //system reports
    FeedbackController,
    BugController,
    //job-management
    JobController,
    JobTagController,
    JobCategoryController,
  ],
  providers: [],
  exports: [],
  imports: [
    AuthModule,
    StoreModule,
    LoggerModule,
    SystemReportsModule,
    UserManagementModule,
    UploadModule,
    JobManagementModule,
  ],
})
export class RoutesModule {}
