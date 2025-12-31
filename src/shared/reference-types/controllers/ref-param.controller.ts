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
import { RefParamService } from '../services/ref-param.service';
import { ResponseRefParamDto } from '../dtos/ref-param/response-ref-param.dto';
import { CreateRefParamDto } from '../dtos/ref-param/create-ref-param.dto';
import { UpdateRefParamDto } from '../dtos/ref-param/update-ref-param.dto';

@ApiTags('ref-param')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/ref-param',
})
export class RefParamController {
  constructor(private readonly refParamService: RefParamService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseRefParamDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseRefParamDto>> {
    const paginated = await this.refParamService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseRefParamDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseRefParamDto[]> {
    return toDtoArray(
      ResponseRefParamDto,
      await this.refParamService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: number,
  ): Promise<ResponseRefParamDto | null> {
    return toDto(
      ResponseRefParamDto,
      await this.refParamService.findOneById(id),
    );
  }

  @Post()
  @LogEvent(EventType.REF_PARAM_CREATE)
  async create(
    @Body() createRefParamDto: CreateRefParamDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseRefParamDto> {
    const region = await this.refParamService.save(createRefParamDto);
    req.logInfo = { id: region.id };
    return toDto(ResponseRefParamDto, region);
  }

  @Put(':id')
  @LogEvent(EventType.REF_PARAM_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateRefParamDto: UpdateRefParamDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseRefParamDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseRefParamDto,
      await this.refParamService.update(id, updateRefParamDto),
    );
  }

  @Delete(':id')
  @LogEvent(EventType.REF_PARAM_DELETE)
  async delete(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseRefParamDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseRefParamDto,
      await this.refParamService.softDelete(id),
    );
  }
}
