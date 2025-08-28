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
import { JobCategoryService } from '../services/job-category.service';
import { ResponseJobCategoryDto } from '../dtos/job-category/response-job-category.dto';
import { CreateJobCategoryDto } from '../dtos/job-category/create-job-category.dto';
import { UpdateJobCategoryDto } from '../dtos/job-category/update-job-category.dto';

@ApiTags('job-category')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/job-category',
})
export class JobCategoryController {
  constructor(private readonly jobCategoryService: JobCategoryService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseJobCategoryDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseJobCategoryDto>> {
    const paginated = await this.jobCategoryService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseJobCategoryDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseJobCategoryDto[]> {
    return toDtoArray(
      ResponseJobCategoryDto,
      await this.jobCategoryService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: number,
  ): Promise<ResponseJobCategoryDto | null> {
    return toDto(
      ResponseJobCategoryDto,
      await this.jobCategoryService.findOneById(id),
    );
  }

  @Post()
  @LogEvent(EventType.JOB_CATEGORY_CREATE)
  async create(
    @Body() createJobCategoryDto: CreateJobCategoryDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobCategoryDto> {
    const jobCategory =
      await this.jobCategoryService.save(createJobCategoryDto);
    req.logInfo = { id: jobCategory.id };
    return toDto(ResponseJobCategoryDto, jobCategory);
  }

  @Put(':id')
  @LogEvent(EventType.JOB_CATEGORY_UPDATE)
  async update(
    @Param('id') id: number,
    @Body() updateJobCategoryDto: UpdateJobCategoryDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobCategoryDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseJobCategoryDto,
      await this.jobCategoryService.update(id, updateJobCategoryDto),
    );
  }

  @Delete(':id')
  @LogEvent(EventType.JOB_CATEGORY_DELETE)
  async delete(
    @Param('id') id: number,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseJobCategoryDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseJobCategoryDto,
      await this.jobCategoryService.softDelete(id),
    );
  }
}
