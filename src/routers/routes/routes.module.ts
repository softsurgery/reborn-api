import { Module } from '@nestjs/common';
import { BugController } from 'src/modules/system-reports/controllers/bug.controller';
import { FeedbackController } from 'src/modules/system-reports/controllers/feedback.controller';
import { SystemReportsModule } from 'src/modules/system-reports/system-reports.module';
import { AuthModule } from 'src/shared/auth/auth.module';
import { AuthController } from 'src/shared/auth/controllers/auth.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { ClientAuthController } from 'src/shared/auth/controllers/client-auth.controller';
import { JobController } from 'src/modules/job-management/controllers/job.controller';
import { JobManagementModule } from 'src/modules/job-management/job-management.module';
import { StoreController } from 'src/shared/store/controllers/store.controller';
import { StoreModule } from 'src/shared/store/store.module';
import { JobRequestController } from 'src/modules/job-management/controllers/job-request.controller';
import { ConversationController } from 'src/modules/chat/controllers/conversation.controller';
import { ChatModule } from 'src/modules/chat/chat.module';
import { MessageController } from 'src/modules/chat/controllers/message.controller';
import { JobSaveController } from 'src/modules/job-management/controllers/job-save.controller';
import { JobViewController } from 'src/modules/job-management/controllers/job-view.controller';
import { NotificationController } from 'src/shared/notifications/controllers/notification.controller';
import { NotificationModule } from 'src/shared/notifications/notifications.module';
import { RefTypeController } from 'src/shared/reference-types/controllers/ref-type.controller';
import { RefParamController } from 'src/shared/reference-types/controllers/ref-param.controller';
import { ReferenceTypesModule } from 'src/shared/reference-types/reference-types.module';
import { StorageController } from 'src/shared/storage/controllers/storage.controller';
import { FollowController } from 'src/shared/abstract-user-management/controllers/follow.controller';
import { UserManagementModule } from 'src/modules/users/user-management.module';
import { StorageModule } from 'src/shared/storage/storage.module';
import { EducationController } from 'src/modules/users/controllers/education.controller';
import { ExperienceController } from 'src/modules/users/controllers/experience.controller';
import { RefImplementationController } from 'src/modules/reference-impl/reference-impl.controller';
import { ReferenceImplModule } from 'src/modules/reference-impl/reference-impl.module';

@Module({
  controllers: [
    //auth
    AuthController,
    ClientAuthController,
    ExperienceController,
    EducationController,
    //common
    StorageController,
    StoreController,
    //user
    FollowController,
    //system reports
    FeedbackController,
    BugController,
    //job-management
    JobController,
    JobRequestController,
    JobSaveController,
    JobViewController,
    //chat
    ConversationController,
    MessageController,
    //notifications
    NotificationController,
    RefTypeController,
    RefParamController,
    //reference-impl
    RefImplementationController,
  ],
  providers: [],
  exports: [],
  imports: [
    AuthModule,
    StoreModule,
    LoggerModule,
    SystemReportsModule,
    UserManagementModule,
    StorageModule,
    JobManagementModule,
    ChatModule,
    NotificationModule,
    ReferenceTypesModule,
    ReferenceImplModule,
  ],
})
export class RoutesModule {}
