import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AdvancedRequest } from 'src/types';
import { NotificationService } from '../services/notification.service';
import { ResponseNotificationDto } from '../dtos/response-notification.dto';
import { NotificationGateway } from './notification.gateway';
import { NotificationType } from '../../../app/enums/notification-type.enum';

@ApiTags('notification')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/notification',
})
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseNotificationDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
    @Request() req: AdvancedRequest,
  ): Promise<PageDto<ResponseNotificationDto>> {
    const paginated = await this.notificationService.findAllPaginatedByUser(
      query,
      req?.user?.sub,
    );
    return {
      ...paginated,
      data: toDtoArray(ResponseNotificationDto, paginated.data),
    };
  }

  @Get('/list/:id')
  @ApiPaginatedResponse(ResponseNotificationDto)
  async findAllUserPaginated(
    @Param('id') id: string,
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseNotificationDto>> {
    const paginated = await this.notificationService.findAllPaginatedByUser(
      query,
      id,
    );
    return {
      ...paginated,
      data: toDtoArray(ResponseNotificationDto, paginated.data),
    };
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: number,
  ): Promise<ResponseNotificationDto | null> {
    return toDto(
      ResponseNotificationDto,
      await this.notificationService.findOneById(id),
    );
  }

  @Post('test/:id')
  async triggerNotification(@Param('id') id: string): Promise<void> {
    await this.notificationGateway.notifyUser(id, NotificationType.TEST, {
      userId: id,
    });
  }
}
