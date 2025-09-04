import { Module } from '@nestjs/common';
import { JobRepository } from './repositories/job.repository';
import { JobService } from './services/job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { JobTagRepository } from './repositories/job-tag.repository';
import { JobTagService } from './services/job-tag.service';
import { JobTagEntity } from './entities/job-tag.entity';
import { JobUploadRepository } from './repositories/job-upload.repository';
import { JobUploadService } from './services/job-upload.service';
import { JobUploadEntity } from './entities/job-upload.entity';
import { UploadModule } from 'src/shared/uploads/uploads.module';
import { JobCategoryRepository } from './repositories/job-category.repository';
import { JobCategoryService } from './services/job-category.service';
import { JobCategoryEntity } from './entities/job-category.entity';
import { JobRequestEntity } from './entities/job-request.entity';
import { JobRequestRepository } from './repositories/job-request.repository';
import { JobRequestService } from './services/job-request.service';

@Module({
  controllers: [],
  providers: [
    JobRepository,
    JobTagRepository,
    JobCategoryRepository,
    JobUploadRepository,
    JobRequestRepository,

    JobService,
    JobTagService,
    JobCategoryService,
    JobUploadService,
    JobRequestService,
  ],
  exports: [
    JobRepository,
    JobTagRepository,
    JobCategoryRepository,
    JobUploadRepository,
    JobRequestRepository,

    JobService,
    JobTagService,
    JobCategoryService,
    JobUploadService,
    JobRequestService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      JobEntity,
      JobTagEntity,
      JobCategoryEntity,
      JobUploadEntity,
      JobRequestEntity,
    ]),
    UploadModule,
  ],
})
export class JobManagementModule {}
