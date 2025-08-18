import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
import { RequestWithLogInfo } from 'src/types';
import { CurrencyService } from '../services/currency.service';
import { ResponseCurrencyDto } from '../dtos/response-currency.dto';
import { CreateCurrencyDto } from '../dtos/create-currency.dto';
import { UpdateCurrencyDto } from '../dtos/update-currency.dto';
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

@ApiTags('currency')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/currency',
})
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseCurrencyDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseCurrencyDto>> {
    const paginated = await this.currencyService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseCurrencyDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseCurrencyDto[]> {
    return toDtoArray(
      ResponseCurrencyDto,
      await this.currencyService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
  ): Promise<ResponseCurrencyDto | null> {
    return toDto(
      ResponseCurrencyDto,
      await this.currencyService.findOneById(id),
    );
  }

  @Post()
  @LogEvent(EventType.REGION_CREATE)
  async create(
    @Body() createCurrencyDto: CreateCurrencyDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseCurrencyDto> {
    const currency = await this.currencyService.save(createCurrencyDto);
    req.logInfo = { id: currency.id };
    return toDto(ResponseCurrencyDto, currency);
  }

  @Put(':id')
  @LogEvent(EventType.REGION_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseCurrencyDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseCurrencyDto,
      await this.currencyService.update(id, updateCurrencyDto),
    );
  }

  @Delete(':id')
  @LogEvent(EventType.REGION_DELETE)
  async delete(
    @Param('id') id: string,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseCurrencyDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseCurrencyDto,
      await this.currencyService.softDelete(id),
    );
  }
}
