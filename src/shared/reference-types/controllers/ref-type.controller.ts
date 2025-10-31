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
import { RefTypeService } from '../services/ref-type.service';
import { ResponseRefTypeDto } from '../dtos/ref-type/response-ref-type.dto';
import { CreateRefTypeDto } from '../dtos/ref-type/create-ref-type.dto';
import { UpdateRefTypeDto } from '../dtos/ref-type/update-ref-type.dto';

@ApiTags('ref-type')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/ref-type',
})
export class RefTypeController {
  constructor(private readonly refTypeService: RefTypeService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseRefTypeDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseRefTypeDto>> {
    const paginated = await this.refTypeService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseRefTypeDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseRefTypeDto[]> {
    return toDtoArray(
      ResponseRefTypeDto,
      await this.refTypeService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
  ): Promise<ResponseRefTypeDto | null> {
    return toDto(ResponseRefTypeDto, await this.refTypeService.findOneById(id));
  }

  @Post()
  @LogEvent(EventType.REF_TYPE_CREATE)
  async create(
    @Body() createRefTypeDto: CreateRefTypeDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseRefTypeDto> {
    const region = await this.refTypeService.save(createRefTypeDto);
    req.logInfo = { id: region.id };
    return toDto(ResponseRefTypeDto, region);
  }

  @Put(':id')
  @LogEvent(EventType.REF_TYPE_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateRefTypeDto: UpdateRefTypeDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseRefTypeDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseRefTypeDto,
      await this.refTypeService.update(id, updateRefTypeDto),
    );
  }

  @Delete(':id')
  @LogEvent(EventType.REF_TYPE_DELETE)
  async delete(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseRefTypeDto | null> {
    req.logInfo = { id };
    return toDto(ResponseRefTypeDto, await this.refTypeService.softDelete(id));
  }
}
