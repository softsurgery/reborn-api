import { Module } from '@nestjs/common';
import { JobRepository } from './repositories/job.repository';
import { JobService } from './services/job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { JobUploadRepository } from './repositories/job-upload.repository';
import { JobUploadService } from './services/job-upload.service';
import { JobUploadEntity } from './entities/job-upload.entity';
import { JobRequestEntity } from './entities/job-request.entity';
import { JobRequestRepository } from './repositories/job-request.repository';
import { JobRequestService } from './services/job-request.service';
import { ChatModule } from '../../shared/chat/chat.module';
import { JobSaveRepository } from './repositories/job-save.repository';
import { JobViewRepository } from './repositories/job-view.repository';
import { JobSaveService } from './services/job-save.service';
import { JobViewService } from './services/job-view.service';
import { JobSaveEntity } from './entities/job-save.entity';
import { JobViewEntity } from './entities/job-view.entity';
import { ReferenceTypesModule } from 'src/shared/reference-types/reference-types.module';
import { UserManagementModule } from '../users/user-management.module';
import { StorageModule } from 'src/shared/storage/storage.module';
import { JobWorkflowService } from './services/job-workflow.service';
import { JobStorageFolderService } from './services/job-storage-folder.service';
import { JobRequestWorkflowService } from './services/job-request-workflow.service';
import { FinanceModule } from '../finance/finance.module';

@Module({
  controllers: [],
  providers: [
    JobRepository,
    JobUploadRepository,
    JobRequestRepository,
    JobSaveRepository,
    JobViewRepository,

    JobService,
    JobUploadService,
    JobRequestService,
    JobSaveService,
    JobViewService,
    JobWorkflowService,
    JobStorageFolderService,
    JobRequestWorkflowService,
  ],
  exports: [
    JobRepository,
    JobUploadRepository,
    JobRequestRepository,
    JobSaveRepository,
    JobViewRepository,

    JobService,
    JobUploadService,
    JobRequestService,
    JobSaveService,
    JobViewService,
    JobWorkflowService,
    JobStorageFolderService,
    JobRequestWorkflowService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      JobEntity,
      JobUploadEntity,
      JobRequestEntity,
      JobSaveEntity,
      JobViewEntity,
    ]),
    UserManagementModule,
    StorageModule,
    ChatModule,
    ReferenceTypesModule,
    FinanceModule,
  ],
})
export class JobManagementModule {}
