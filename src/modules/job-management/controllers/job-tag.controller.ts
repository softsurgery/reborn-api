import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
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
import { JobTagService } from '../services/job-tag.service';
import { ResponseJobTagDto } from '../dtos/job-tag/response-job-tag.dto';
import { CreateJobTagDto } from '../dtos/job-tag/create-job-tag.dto';
import { UpdateJobTagDto } from '../dtos/job-tag/update-job-tag.dto';

@ApiTags('job-tag')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/job-tag',
})
export class JobTagController {
  constructor(private readonly jobTagService: JobTagService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseJobTagDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseJobTagDto>> {
    const paginated = await this.jobTagService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseJobTagDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseJobTagDto[]> {
    return toDtoArray(
      ResponseJobTagDto,
      await this.jobTagService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: number,
  ): Promise<ResponseJobTagDto | null> {
    return toDto(ResponseJobTagDto, await this.jobTagService.findOneById(id));
  }

  @Post()
  @LogEvent(EventType.JOB_TAG_CREATE)
  async create(
    @Body() createJobTagDto: CreateJobTagDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobTagDto> {
    const jobTag = await this.jobTagService.save(createJobTagDto);
    req.logInfo = { id: jobTag.id };
    return toDto(ResponseJobTagDto, jobTag);
  }

  @Put(':id')
  @LogEvent(EventType.JOB_TAG_UPDATE)
  async update(
    @Param('id') id: number,
    @Body() updateJobTagDto: UpdateJobTagDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobTagDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseJobTagDto,
      await this.jobTagService.update(id, updateJobTagDto),
    );
  }

  @Delete(':id')
  @LogEvent(EventType.JOB_TAG_DELETE)
  async delete(
    @Param('id') id: number,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobTagDto | null> {
    req.logInfo = { id };
    return toDto(ResponseJobTagDto, await this.jobTagService.softDelete(id));
  }
}
