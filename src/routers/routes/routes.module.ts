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
import { JobRequestController } from 'src/modules/job-management/controllers/job-request.controller';
import { JobRequestWorkflowController } from 'src/modules/job-management/controllers/job-request-workflow.controller';
import { ConversationController } from 'src/shared/chat/controllers/conversation.controller';
import { ChatModule } from 'src/shared/chat/chat.module';
import { MessageController } from 'src/shared/chat/controllers/message.controller';
import { JobSaveController } from 'src/modules/job-management/controllers/job-save.controller';
import { JobViewController } from 'src/modules/job-management/controllers/job-view.controller';
import { NotificationController } from 'src/shared/notifications/controllers/notification.controller';
import { NotificationModule } from 'src/shared/notifications/notifications.module';
import { RefTypeController } from 'src/shared/reference-types/controllers/ref-type.controller';
import { RefParamController } from 'src/shared/reference-types/controllers/ref-param.controller';
import { ReferenceTypesModule } from 'src/shared/reference-types/reference-types.module';
import { StorageController } from 'src/shared/storage/controllers/storage.controller';
import { StorageFolderController } from 'src/shared/storage/controllers/storage-folder.controller';
import { FollowController } from 'src/shared/abstract-user-management/controllers/follow.controller';
import { UserManagementModule } from 'src/modules/users/user-management.module';
import { StorageModule } from 'src/shared/storage/storage.module';
import { EducationController } from 'src/modules/users/controllers/education.controller';
import { ExperienceController } from 'src/modules/users/controllers/experience.controller';
import { CurrentConversationController } from 'src/shared/chat/controllers/user-conversation.controller';
import { CurrentJobController } from 'src/modules/job-management/controllers/current-job.controller';
import { ConfigurationController } from 'src/shared/configurations/controllers/configuration.controller';
import { ConfigurationsModule } from 'src/shared/configurations/configurations.module';
import { JobWorkflowController } from 'src/modules/job-management/controllers/job-workflow.controller';
import { TaskController } from 'src/shared/tasks/controllers/task.controller';
import { TasksModule } from 'src/shared/tasks/tasks.module';
import { FinanceController } from './controllers/finance.controller';
import { FinanceModule } from 'src/modules/finance/finance.module';

@Module({
  controllers: [
    //auth
    AuthController,
    ClientAuthController,
    ExperienceController,
    EducationController,
    //common
    StorageController,
    StorageFolderController,
    //user
    FollowController,
    //system reports
    FeedbackController,
    BugController,
    //job-management
    CurrentJobController,
    JobController,
    JobWorkflowController,
    JobRequestWorkflowController,
    JobRequestController,
    JobSaveController,
    JobViewController,
    //chat
    ConversationController,
    MessageController,
    CurrentConversationController,
    //notifications
    NotificationController,
    RefTypeController,
    RefParamController,
    ConfigurationController,
    TaskController,
    //finance
    FinanceController,
  ],
  providers: [],
  exports: [],
  imports: [
    AuthModule,
    LoggerModule,
    SystemReportsModule,
    UserManagementModule,
    StorageModule,
    JobManagementModule,
    ChatModule,
    NotificationModule,
    ReferenceTypesModule,
    ConfigurationsModule,
    TasksModule,
    FinanceModule,
  ],
})
export class RoutesModule {}
