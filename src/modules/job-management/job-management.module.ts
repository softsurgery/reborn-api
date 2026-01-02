import { Module } from '@nestjs/common';
import { JobRepository } from './repositories/job.repository';
import { JobService } from './services/job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { JobUploadRepository } from './repositories/job-upload.repository';
import { JobUploadService } from './services/job-upload.service';
import { JobUploadEntity } from './entities/job-upload.entity';
import { UploadModule } from 'src/shared/uploads/uploads.module';
import { JobRequestEntity } from './entities/job-request.entity';
import { JobRequestRepository } from './repositories/job-request.repository';
import { JobRequestService } from './services/job-request.service';
import { ChatModule } from '../chat/chat.module';
import { JobSaveRepository } from './repositories/job-save.repository';
import { JobViewRepository } from './repositories/job-view.repository';
import { JobSaveService } from './services/job-save.service';
import { JobViewService } from './services/job-view.service';
import { JobSaveEntity } from './entities/job-save.entity';
import { JobViewEntity } from './entities/job-view.entity';
import { UserManagementModule } from '../user-management/user-management.module';
import { ReferenceTypesModule } from 'src/shared/reference-types/reference-types.module';

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
    UploadModule,
    ChatModule,
    ReferenceTypesModule,
  ],
})
export class JobManagementModule {}
