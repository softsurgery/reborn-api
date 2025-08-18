import { Module } from '@nestjs/common';
import { JobRepository } from './repositories/job.repository';
import { JobService } from './services/job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { JobTagRepository } from './repositories/job-tag.repository';
import { JobTagService } from './services/job-tag.service';
import { JobTagEntity } from './entities/job-tag.entity';

@Module({
  controllers: [],
  providers: [JobRepository, JobTagRepository, JobService, JobTagService],
  exports: [JobRepository, JobTagRepository, JobService, JobTagService],
  imports: [TypeOrmModule.forFeature([JobEntity, JobTagEntity])],
})
export class JobManagementModule {}
