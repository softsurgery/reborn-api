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
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { JobSaveService } from '../services/job-save.service';
import { ResponseJobSaveDto } from '../dtos/job-save/response-job-save.dto';
import { CreateJobSaveDto } from '../dtos/job-save/create-job-save.dto';

@ApiTags('job-save')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/job-save',
})
export class JobSaveController {
  constructor(private readonly jobSaveService: JobSaveService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseJobSaveDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseJobSaveDto>> {
    const paginated = await this.jobSaveService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseJobSaveDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseJobSaveDto[]> {
    return toDtoArray(
      ResponseJobSaveDto,
      await this.jobSaveService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: number,
  ): Promise<ResponseJobSaveDto | null> {
    return toDto(ResponseJobSaveDto, await this.jobSaveService.findOneById(id));
  }

  @Post()
  @LogEvent(EventType.JOB_SAVE_CREATE)
  async create(
    @Body() createJobRequestDto: CreateJobSaveDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobSaveDto> {
    const jobSave = await this.jobSaveService.save(
      createJobRequestDto,
      req.user?.sub,
    );
    req.logInfo = { id: jobSave.id };
    return toDto(ResponseJobSaveDto, jobSave);
  }

  @Delete(':id')
  @LogEvent(EventType.JOB_SAVE_DELETE)
  async delete(
    @Param('id') id: number,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobSaveDto | null> {
    req.logInfo = { id };
    return toDto(ResponseJobSaveDto, await this.jobSaveService.softDelete(id));
  }
}
