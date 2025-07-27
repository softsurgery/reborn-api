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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { DeviceInfoService } from '../services/device-info.service';
import { ResponseDeviceInfoDto } from '../dtos/device-info/response-device-info.dto';
import { CreateDeviceInfoDto } from '../dtos/device-info/create-device-info.dto';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
import { RequestWithLogInfo } from 'src/types';

@ApiTags('device-info')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/device-info',
})
export class DeviceInfoController {
  constructor(private readonly deviceInfoService: DeviceInfoService) {}

  @Get('/list')
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseDeviceInfoDto>> {
    const paginated = await this.deviceInfoService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseDeviceInfoDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseDeviceInfoDto[]> {
    return toDtoArray(
      ResponseDeviceInfoDto,
      await this.deviceInfoService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
  ): Promise<ResponseDeviceInfoDto | null> {
    return toDto(
      ResponseDeviceInfoDto,
      await this.deviceInfoService.findOneById(id),
    );
  }

  @Post()
  @LogEvent(EventType.DEVICE_INFO_CREATE)
  async create(
    @Body() createDeviceInfoDto: CreateDeviceInfoDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseDeviceInfoDto> {
    const deviceInfo = await this.deviceInfoService.save(createDeviceInfoDto);
    req.logInfo = { id: deviceInfo.id };
    return toDto(ResponseDeviceInfoDto, deviceInfo);
  }

  @Delete(':id')
  @LogEvent(EventType.DEVICE_INFO_DELETE)
  async delete(
    @Param('id') id: string,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseDeviceInfoDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseDeviceInfoDto,
      await this.deviceInfoService.softDelete(id),
    );
  }
}
