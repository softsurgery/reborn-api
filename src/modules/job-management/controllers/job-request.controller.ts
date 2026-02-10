import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
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
import { NotificationInterceptor } from 'src/shared/notifications/decorators/notification.interceptor';
import { Notify } from 'src/shared/notifications/decorators/notify.decorator';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { JobService } from '../services/job.service';
import { identifyUser } from 'src/shared/abstract-user-management/utils/identify-user';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@ApiTags('job-request')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@UseInterceptors(NotificationInterceptor)
@Controller({
  version: '1',
  path: '/job-request',
})
export class JobRequestController {
  constructor(
    private readonly jobRequestService: JobRequestService,
    private readonly jobService: JobService,
  ) {}

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
    @Request() req: AdvancedRequest,
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
    @Request() req: AdvancedRequest,
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
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobRequestDto | null> {
    return toDto(
      ResponseJobRequestDto,
      await this.jobRequestService.isJobRequestAlreadyExists(id, req.user?.sub),
    );
  }

  @Post()
  @LogEvent(EventType.JOB_REQUEST_CREATE)
  @Notify(NotificationType.NEW_JOB_REQUEST)
  async create(
    @Body() createJobRequestDto: CreateJobRequestDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobRequestDto> {
    const request = await this.jobRequestService.save(
      createJobRequestDto,
      req.user?.sub,
    );
    const job = request?.jobId
      ? await this.jobService.findOneById(request?.jobId)
      : null;
    req.logInfo = { id: request.id };
    req.notificationInfo = {
      id: request?.jobId,
      title: job?.title,
      fullname: identifyUser(job?.postedBy as UserEntity),
      userId: job?.postedById,
    };
    return toDto(ResponseJobRequestDto, request);
  }

  @Put(':id')
  @LogEvent(EventType.JOB_REQUEST_UPDATE)
  async update(
    @Param('id') id: number,
    @Body() updateJobRequestDto: UpdateJobRequestDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobRequestDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseJobRequestDto,
      await this.jobRequestService.update(id, updateJobRequestDto),
    );
  }

  @Put(':id/approve')
  @LogEvent(EventType.JOB_REQUEST_APPROVE)
  @Notify(NotificationType.JOB_REQUEST_APPROVED)
  async approve(
    @Param('id') id: number,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobRequestDto | null> {
    const request = await this.jobRequestService.approveJobRequest(id);
    const job = request?.jobId
      ? await this.jobService.findOneById(request?.jobId)
      : null;
    req.logInfo = { id };
    req.notificationInfo = {
      id: request?.jobId,
      title: job?.title,
      userId: request?.userId,
    };
    return toDto(ResponseJobRequestDto, request);
  }

  @Put(':id/reject')
  @LogEvent(EventType.JOB_REQUEST_REJECT)
  @Notify(NotificationType.JOB_REQUEST_REJECTED)
  async reject(
    @Param('id') id: number,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobRequestDto | null> {
    const request = await this.jobRequestService.rejectJobRequest(id);
    const job = request?.jobId
      ? await this.jobService.findOneById(request?.jobId)
      : null;
    req.logInfo = { id };
    req.notificationInfo = {
      id: request?.jobId,
      title: job?.title,
      userId: request?.userId,
    };
    return toDto(ResponseJobRequestDto, request);
  }

  @Put(':id/cancel')
  @LogEvent(EventType.JOB_REQUEST_CANCEL)
  async cancel(
    @Param('id') id: number,
    @Request() req: AdvancedRequest,
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
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobRequestDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseJobRequestDto,
      await this.jobRequestService.softDelete(id),
    );
  }
}
