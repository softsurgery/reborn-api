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

@Module({
  controllers: [],
  providers: [
    JobRepository,
    JobTagRepository,
    JobCategoryRepository,
    JobUploadRepository,

    JobService,
    JobTagService,
    JobCategoryService,
    JobUploadService,
  ],
  exports: [
    JobRepository,
    JobTagRepository,
    JobCategoryRepository,
    JobUploadRepository,

    JobService,
    JobTagService,
    JobCategoryService,
    JobUploadService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      JobEntity,
      JobTagEntity,
      JobCategoryEntity,
      JobUploadEntity,
    ]),
    UploadModule,
  ],
})
export class JobManagementModule {}
