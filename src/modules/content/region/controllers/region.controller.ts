import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
import { RequestWithLogInfo } from 'src/types';
import { RegionService } from '../services/region.service';
import { ResponseRegionDto } from '../dtos/response-region.dto';
import { CreateRegionDto } from '../dtos/create-region.dto';
import { UpdateRegionDto } from '../dtos/update-region.dto';
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

@ApiTags('region')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/region',
})
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseRegionDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseRegionDto>> {
    const paginated = await this.regionService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseRegionDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseRegionDto[]> {
    return toDtoArray(
      ResponseRegionDto,
      await this.regionService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
  ): Promise<ResponseRegionDto | null> {
    return toDto(ResponseRegionDto, await this.regionService.findOneById(id));
  }

  @Post()
  @LogEvent(EventType.REGION_CREATE)
  async create(
    @Body() createRegionDto: CreateRegionDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseRegionDto> {
    const region = await this.regionService.save(createRegionDto);
    req.logInfo = { id: region.id };
    return toDto(ResponseRegionDto, region);
  }

  @Put(':id')
  @LogEvent(EventType.REGION_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateRegionDto: UpdateRegionDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseRegionDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseRegionDto,
      await this.regionService.update(id, updateRegionDto),
    );
  }

  @Delete(':id')
  @LogEvent(EventType.REGION_DELETE)
  async delete(
    @Param('id') id: string,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseRegionDto | null> {
    req.logInfo = { id };
    return toDto(ResponseRegionDto, await this.regionService.softDelete(id));
  }
}
