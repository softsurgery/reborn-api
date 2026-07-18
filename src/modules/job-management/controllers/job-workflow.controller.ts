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
import { JobWorkflowService } from '../services/job-workflow.service';
import { ResponseJobWorkflowDto } from '../dtos/job/response-job-workflow.dto';
import { UpdateJobStatusDto } from '../dtos/job/update-job-status.dto';

@ApiTags('job-workflow')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/job-workflow',
})
export class JobWorkflowController {
  constructor(private readonly jobWorkflowService: JobWorkflowService) {}

  @Get('machine')
  getMachine(): Record<string, unknown> {
    return this.jobWorkflowService.getMachine();
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
    @Query('join') join?: string,
  ): Promise<ResponseJobWorkflowDto | null> {
    return toDto(
      ResponseJobWorkflowDto,
      await this.jobWorkflowService.findOneById(id, join),
    );
  }

  @Post(':id/next')
  async next(
    @Param('id') id: string,
    @Body() updateJobStatusDto: UpdateJobStatusDto,
  ): Promise<ResponseJobWorkflowDto> {
    const updatedJob = await this.jobWorkflowService.next(
      id,
      updateJobStatusDto.event,
    );
    return toDto(ResponseJobWorkflowDto, updatedJob);
  }
}
