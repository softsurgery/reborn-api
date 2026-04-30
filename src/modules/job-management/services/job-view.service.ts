import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { JobViewRepository } from '../repositories/job-view.repository';
import { JobViewEntity } from '../entities/job-view.entity';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export class JobViewService extends AbstractCrudService<JobViewEntity> {
  constructor(private readonly jobViewRepository: JobViewRepository) {
    super(jobViewRepository);
  }

  @Transactional()
  async markAsViewed(jobId: string, savedBy?: string): Promise<JobViewEntity> {
    const jobView = await this.jobViewRepository.findOne({
      where: { jobId, userId: savedBy },
    });
    if (!jobView) {
      return await this.jobViewRepository.save({
        jobId,
        userId: savedBy,
      });
    }
    return jobView;
  }
}
