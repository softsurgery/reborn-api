import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { toDtoArray } from 'src/shared/database/utils/dtos';
import { SessionService } from '../services/session.service';
import { ResponseSessionDto } from '../dtos/response-session.dto';
import { AdvancedRequest } from 'src/types';

@ApiTags('session')
@ApiBearerAuth('access_token')
@Controller({
  version: '1',
  path: '/session',
})
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('/list')
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseSessionDto>> {
    const paginated = await this.sessionService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseSessionDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseSessionDto[]> {
    return toDtoArray(
      ResponseSessionDto,
      await this.sessionService.findAll(options),
    );
  }

  @Get('/active-list')
  @ApiPaginatedResponse(ResponseSessionDto)
  async findAllPaginatedActiveSessions(
    @Query() query: IQueryObject,
    @Req() req: AdvancedRequest,
  ): Promise<PageDto<ResponseSessionDto>> {
    const paginated =
      await this.sessionService.findAllPaginatedActiveUserSessions(
        query,
        req.user?.sub,
      );
    return {
      ...paginated,
      data: toDtoArray(ResponseSessionDto, paginated.data),
    };
  }

  @Get('/active-all')
  async findAllActiveSessions(
    @Query() query: IQueryObject,
    @Req() req: AdvancedRequest,
  ): Promise<ResponseSessionDto[]> {
    return toDtoArray(
      ResponseSessionDto,
      await this.sessionService.findAllActiveUserSessions(query, req.user?.sub),
    );
  }

  @Get('/active-list/:userId')
  @ApiPaginatedResponse(ResponseSessionDto)
  async findAllPaginatedActiveUserSessions(
    @Query() query: IQueryObject,
    @Param('userId') userId: string,
  ): Promise<PageDto<ResponseSessionDto>> {
    const paginated = await this.sessionService.findAllPaginatedUserSessions(
      query,
      userId,
    );
    return {
      ...paginated,
      data: toDtoArray(ResponseSessionDto, paginated.data),
    };
  }

  @Get('/active-all/:userId')
  async findAllActiveUserSessions(
    @Query() query: IQueryObject,
    @Param('userId') userId: string,
  ): Promise<ResponseSessionDto[]> {
    return toDtoArray(
      ResponseSessionDto,
      await this.sessionService.findAllActiveUserSessions(query, userId),
    );
  }
}
