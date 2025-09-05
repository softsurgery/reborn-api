import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
import { RequestWithLogInfo } from 'src/types';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { JobRequestService } from '../services/job-request.service';
import { ResponseJobRequestDto } from '../dtos/job-request/response-job-request.dto';
import { CreateJobRequestDto } from '../dtos/job-request/create-job-request.dto';
import { UpdateJobRequestDto } from '../dtos/job-request/update-job-request.dto';

@ApiTags('job-request')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/job-request',
})
export class JobRequestController {
  constructor(private readonly jobRequestService: JobRequestService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseJobRequestDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseJobRequestDto>> {
    const paginated = await this.jobRequestService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseJobRequestDto, paginated.data),
    };
  }

  @Get('/list-incoming')
  @ApiPaginatedResponse(ResponseJobRequestDto)
  async findAllPaginatedIncoming(
    @Query() query: IQueryObject,
    @Request() req: RequestWithLogInfo,
  ): Promise<PageDto<ResponseJobRequestDto>> {
    const paginated =
      await this.jobRequestService.findPaginatedUserIncomingJobRequests(
        query,
        req.user?.sub,
      );
    return {
      ...paginated,
      data: toDtoArray(ResponseJobRequestDto, paginated.data),
    };
  }

  @Get('/list-ongoing')
  @ApiPaginatedResponse(ResponseJobRequestDto)
  async findAllPaginatedOngoing(
    @Query() query: IQueryObject,
    @Request() req: RequestWithLogInfo,
  ): Promise<PageDto<ResponseJobRequestDto>> {
    const paginated =
      await this.jobRequestService.findPaginatedUserOngoingJobRequests(
        query,
        req.user?.sub,
      );
    return {
      ...paginated,
      data: toDtoArray(ResponseJobRequestDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseJobRequestDto[]> {
    return toDtoArray(
      ResponseJobRequestDto,
      await this.jobRequestService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: number,
  ): Promise<ResponseJobRequestDto | null> {
    return toDto(
      ResponseJobRequestDto,
      await this.jobRequestService.findOneById(id),
    );
  }

  @Get(':id/exists')
  async isJobRequestAlreadyExists(
    @Param('id') id: string,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobRequestDto | null> {
    return toDto(
      ResponseJobRequestDto,
      await this.jobRequestService.isJobRequestAlreadyExists(id, req.user?.sub),
    );
  }

  @Post()
  @LogEvent(EventType.JOB_REQUEST_CREATE)
  async create(
    @Body() createJobRequestDto: CreateJobRequestDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobRequestDto> {
    const jobRequest = await this.jobRequestService.save(
      createJobRequestDto,
      req.user?.sub,
    );
    req.logInfo = { id: jobRequest.id };
    return toDto(ResponseJobRequestDto, jobRequest);
  }

  @Put(':id')
  @LogEvent(EventType.JOB_REQUEST_UPDATE)
  async update(
    @Param('id') id: number,
    @Body() updateJobRequestDto: UpdateJobRequestDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobRequestDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseJobRequestDto,
      await this.jobRequestService.update(id, updateJobRequestDto),
    );
  }

  @Put(':id/approve')
  @LogEvent(EventType.JOB_REQUEST_APPROVE)
  async approve(
    @Param('id') id: number,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobRequestDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseJobRequestDto,
      await this.jobRequestService.approveJobRequest(id),
    );
  }

  @Put(':id/reject')
  @LogEvent(EventType.JOB_REQUEST_REJECT)
  async reject(
    @Param('id') id: number,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobRequestDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseJobRequestDto,
      await this.jobRequestService.rejectJobRequest(id),
    );
  }

  @Put(':id/cancel')
  @LogEvent(EventType.JOB_REQUEST_CANCEL)
  async cancel(
    @Param('id') id: number,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobRequestDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseJobRequestDto,
      await this.jobRequestService.cancelJobRequest(id),
    );
  }

  @Delete(':id')
  @LogEvent(EventType.JOB_REQUEST_DELETE)
  async delete(
    @Param('id') id: number,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobRequestDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseJobRequestDto,
      await this.jobRequestService.softDelete(id),
    );
  }
}
