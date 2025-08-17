import { Module } from '@nestjs/common';
import { JobRepository } from './repositories/job.repository';
import { JobService } from './services/job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';

@Module({
  controllers: [],
  providers: [JobRepository, JobService],
  exports: [JobRepository, JobService],
  imports: [TypeOrmModule.forFeature([JobEntity])],
})
export class JobManagementModule {}
