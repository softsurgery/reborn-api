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
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
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

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseJobDto[]> {
    return toDtoArray(ResponseJobDto, await this.jobService.findAll(options));
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
    @Query() query: IQueryObject,
  ): Promise<ResponseJobDto | null> {
    return toDto(
      ResponseJobDto,
      await this.jobService.findOneById(id, query.join),
    );
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
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobDto> {
    const { tagIds, ...rest } = createJobDto;
    const job = await this.jobService.extendedSave(
      rest,
      tagIds,
      req?.user?.sub,
    );
    req.logInfo = { id: job.id, title: job.title };
    return toDto(ResponseJobDto, job);
  }

  @Put(':id')
  @LogEvent(EventType.JOB_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobDto | null> {
    const { tagIds, ...rest } = updateJobDto;
    const job = await this.jobService.extendedUpdate(id, rest, tagIds);
    req.logInfo = { id, title: job?.title };
    return toDto(ResponseJobDto, job);
  }

  @Delete(':id')
  @LogEvent(EventType.JOB_DELETE)
  async delete(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobDto | null> {
    const job = await this.jobService.softDelete(id);
    req.logInfo = { id, title: job?.title };
    return toDto(ResponseJobDto, job);
  }

  @Post(':id/duplicate')
  @LogEvent(EventType.JOB_DUPLICATE)
  async duplicate(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobDto> {
    const job = await this.jobService.duplicate(id, req?.user?.sub);
    req.logInfo = { id: job.id, title: job.title };
    return toDto(ResponseJobDto, job);
  }
}
