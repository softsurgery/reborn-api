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

@Module({
  controllers: [],
  providers: [
    JobRepository,
    JobTagRepository,
    JobUploadRepository,

    JobService,
    JobTagService,
    JobUploadService,
  ],
  exports: [
    JobRepository,
    JobTagRepository,
    JobUploadRepository,

    JobService,
    JobTagService,
    JobUploadService,
  ],
  imports: [
    TypeOrmModule.forFeature([JobEntity, JobTagEntity, JobUploadEntity]),
    UploadModule,
  ],
})
export class JobManagementModule {}
