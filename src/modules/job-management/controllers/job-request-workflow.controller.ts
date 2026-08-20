import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { toDto } from 'src/shared/database/utils/dtos';
import { JobRequestWorkflowService } from '../services/job-request-workflow.service';
import { ResponseJobRequestWorkflowDto } from '../dtos/job-request/response-job-request-workflow.dto';
import { UpdateJobRequestStatusDto } from '../dtos/job-request/update-job-request-status.dto';

@ApiTags('job-request-workflow')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/job-request-workflow',
})
export class JobRequestWorkflowController {
  constructor(
    private readonly jobRequestWorkflowService: JobRequestWorkflowService,
  ) {}

  @Get('machine')
  getMachine(): Record<string, unknown> {
    return this.jobRequestWorkflowService.getMachine();
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: number,
    @Query('join') join?: string,
  ): Promise<ResponseJobRequestWorkflowDto | null> {
    return toDto(
      ResponseJobRequestWorkflowDto,
      await this.jobRequestWorkflowService.findOneById(id, join),
    );
  }

  @Post(':id/next')
  async next(
    @Param('id') id: number,
    @Body() updateJobRequestStatusDto: UpdateJobRequestStatusDto,
  ): Promise<ResponseJobRequestWorkflowDto> {
    const updatedJobRequest = await this.jobRequestWorkflowService.next(
      id,
      updateJobRequestStatusDto.event,
    );
    return toDto(ResponseJobRequestWorkflowDto, updatedJobRequest);
  }
}
