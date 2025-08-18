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
import { ResponseJobDto } from '../dtos/response-job.dto';
import { CreateJobDto } from '../dtos/create-job.dto';
import { UpdateJobDto } from '../dtos/update-job.dto';

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
  async findOneById(@Param('id') id: string): Promise<ResponseJobDto | null> {
    return toDto(ResponseJobDto, await this.jobService.findOneById(id));
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
    const job = await this.jobService.update(id, updateJobDto);
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
