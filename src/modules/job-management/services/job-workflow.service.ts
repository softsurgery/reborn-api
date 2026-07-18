import { AbstractWorkflowService } from 'src/shared/workflows/services/workflow.service';
import { JobService } from './job.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JobStatus } from '../enums/workflow/job-status.enum';
import { JobEvents } from '../enums/workflow/job-events.enum';
import { jobMachine } from '../workflows/job.workflow';

@Injectable()
export class JobWorkflowService extends AbstractWorkflowService<
  JobStatus,
  JobEvents
> {
  constructor(private readonly jobService: JobService) {
    super(jobMachine, JobEvents);
  }

  async findOneById(id: string, join?: string) {
    const job = await this.jobService.findOneById(id, join);
    if (!job) {
      throw new BadRequestException(`Job with ID ${id} not found`);
    }
    return {
      status: job.status,
      isUpdatable: this.isUpdatable(job.status),
      nextSteps: this.getNextSteps(job.status),
      job,
    };
  }

  async next(id: string, event: JobEvents) {
    const job = await this.jobService.findOneById(id);
    if (!job) {
      throw new BadRequestException(`Job with ID ${id} not found`);
    }
    const newStatus = this.transition(job.status, event);
    await this.jobService.save({ id: job.id, status: newStatus });
    return this.findOneById(id);
  }

  getMachine(): Record<string, unknown> {
    return this.getMachineConfig();
  }
}
