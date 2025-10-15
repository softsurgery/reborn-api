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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JobService } from '../services/job.service';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
import { RequestWithLogInfo } from 'src/types';
import { ResponseJobDto } from '../dtos/job/response-job.dto';
import { CreateJobDto } from '../dtos/job/create-job.dto';
import { UpdateJobDto } from '../dtos/job/update-job.dto';
import { ResponseJobMetadataDto } from '../dtos/job/response-job-metadata.dto';

@ApiTags('job')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/job',
})
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseJobDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseJobDto>> {
    const paginated = await this.jobService.findAllPaginated(query);
    return { ...paginated, data: toDtoArray(ResponseJobDto, paginated.data) };
  }

  @Get('/list-followed')
  @ApiPaginatedResponse(ResponseJobDto)
  async findAllFollowedPaginated(
    @Query() query: IQueryObject,
    @Request() req: RequestWithLogInfo,
  ): Promise<PageDto<ResponseJobDto>> {
    const paginated = await this.jobService.findAllFollowedPaginated(
      query,
      req.user?.sub,
    );
    return { ...paginated, data: toDtoArray(ResponseJobDto, paginated.data) };
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseJobDto[]> {
    return toDtoArray(ResponseJobDto, await this.jobService.findAll(options));
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<ResponseJobDto | null> {
    return toDto(ResponseJobDto, await this.jobService.findOneById(id));
  }

  @Get(':id/metadata')
  async findOneMetadataById(
    @Param('id') id: string,
  ): Promise<ResponseJobMetadataDto | null> {
    return toDto(
      ResponseJobMetadataDto,
      await this.jobService.findJobMetadataById(id),
    );
  }

  @Post()
  @LogEvent(EventType.JOB_CREATE)
  async create(
    @Body() createJobDto: CreateJobDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobDto> {
    const job = await this.jobService.saveJob(createJobDto, req?.user?.sub);
    req.logInfo = { id: job.id, title: job.title };
    return toDto(ResponseJobDto, job);
  }

  @Put(':id')
  @LogEvent(EventType.JOB_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobDto | null> {
    const job = await this.jobService.updateJob(id, updateJobDto);
    req.logInfo = { id, title: job?.title };
    return toDto(ResponseJobDto, job);
  }

  @Delete(':id')
  @LogEvent(EventType.JOB_DELETE)
  async delete(
    @Param('id') id: string,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobDto | null> {
    const job = await this.jobService.softDelete(id);
    req.logInfo = { id, title: job?.title };
    return toDto(ResponseJobDto, job);
  }
}
