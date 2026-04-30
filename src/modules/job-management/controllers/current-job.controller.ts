import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JobService } from '../services/job.service';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { AdvancedRequest } from 'src/types';
import { ResponseJobDto } from '../dtos/job/response-job.dto';

@ApiTags('current-job')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/current-job',
})
export class CurrentJobController {
  constructor(private readonly jobService: JobService) {}

  @Get('/list-followed')
  @ApiPaginatedResponse(ResponseJobDto)
  async findAllFollowedPaginated(
    @Query() query: IQueryObject,
    @Request() req: AdvancedRequest,
  ): Promise<PageDto<ResponseJobDto>> {
    const paginated = await this.jobService.findAllFollowedPaginated(
      query,
      req.user?.sub,
    );
    return { ...paginated, data: toDtoArray(ResponseJobDto, paginated.data) };
  }
}
