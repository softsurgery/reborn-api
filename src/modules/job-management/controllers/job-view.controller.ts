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
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { JobViewService } from '../services/job-view.service';
import { ResponseJobViewDto } from '../dtos/job-view/response-job-view.dto';
import { CreateJobViewDto } from '../dtos/job-view/create-job-view.dto';

@ApiTags('job-view')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/job-view',
})
export class JobViewController {
  constructor(private readonly jobViewService: JobViewService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseJobViewDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseJobViewDto>> {
    const paginated = await this.jobViewService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseJobViewDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseJobViewDto[]> {
    return toDtoArray(
      ResponseJobViewDto,
      await this.jobViewService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: number,
  ): Promise<ResponseJobViewDto | null> {
    return toDto(ResponseJobViewDto, await this.jobViewService.findOneById(id));
  }

  @Post()
  @LogEvent(EventType.JOB_VIEW_CREATE)
  async create(
    @Body() createJobRequestDto: CreateJobViewDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobViewDto> {
    const jobView = await this.jobViewService.markAsViewed(
      createJobRequestDto.jobId,
      req.user?.sub,
    );
    req.logInfo = { id: jobView.id };
    return toDto(ResponseJobViewDto, jobView);
  }

  @Delete(':id')
  @LogEvent(EventType.JOB_VIEW_DELETE)
  async delete(
    @Param('id') id: number,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseJobViewDto | null> {
    req.logInfo = { id };
    return toDto(ResponseJobViewDto, await this.jobViewService.softDelete(id));
  }
}
