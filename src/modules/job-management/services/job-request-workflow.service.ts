import { AbstractWorkflowService } from 'src/shared/workflows/services/workflow.service';
import { JobRequestService } from './job-request.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JobRequestStatus } from '../enums/job-request-status.enum';
import { JobRequestEvents } from '../enums/workflow/job-request-events.enum';
import { jobRequestMachine } from '../workflows/job-request.workflow';

@Injectable()
export class JobRequestWorkflowService extends AbstractWorkflowService<
  JobRequestStatus,
  JobRequestEvents
> {
  constructor(private readonly jobRequestService: JobRequestService) {
    super(jobRequestMachine, JobRequestEvents);
  }

  async findOneById(id: number, join?: string) {
    const jobRequest = await this.jobRequestService.findOneById(id, join);
    if (!jobRequest) {
      throw new BadRequestException(`Job request with ID ${id} not found`);
    }
    return {
      status: jobRequest.status,
      isUpdatable: this.isUpdatable(jobRequest.status),
      nextSteps: this.getNextSteps(jobRequest.status),
      jobRequest,
    };
  }

  async next(id: number, event: JobRequestEvents) {
    const jobRequest = await this.jobRequestService.findOneById(id);
    if (!jobRequest) {
      throw new BadRequestException(`Job request with ID ${id} not found`);
    }

    this.transition(jobRequest.status, event);

    if (event === JobRequestEvents.Approve) {
      await this.jobRequestService.approveJobRequest(id);
    } else if (event === JobRequestEvents.Reject) {
      await this.jobRequestService.rejectJobRequest(id);
    } else if (event === JobRequestEvents.Cancel) {
      await this.jobRequestService.cancelJobRequest(id);
    }

    return this.findOneById(id);
  }

  getMachine(): Record<string, unknown> {
    return this.getMachineConfig();
  }
}
