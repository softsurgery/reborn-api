import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../services/logger.service';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { LogEntity } from '../entities/log.entity';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ResponseLogDto } from '../dtos/response-log.dto';
import { toDtoArray } from 'src/shared/database/utils/dtos';

@ApiTags('logger')
@ApiBearerAuth('access_token')
@Controller({
  version: '1',
  path: '/logger',
})
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseLogDto[]> {
    return toDtoArray(
      ResponseLogDto,
      await this.loggerService.findAll(options),
    );
  }

  @Get('/list')
  @ApiPaginatedResponse(LogEntity)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseLogDto>> {
    const paginated = await this.loggerService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseLogDto, paginated.data),
    };
  }
}
