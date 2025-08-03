import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '../services/profile.service';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
import { RequestWithLogInfo } from 'src/types';
import { ResponseProfileDto } from '../dtos/profile/response-profile.dto';
import { UpdateProfileDto } from '../dtos/profile/update-profile.dto';

@ApiTags('profile')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/profile',
})
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseProfileDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseProfileDto>> {
    const paginated = await this.profileService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseProfileDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseProfileDto[]> {
    return toDtoArray(
      ResponseProfileDto,
      await this.profileService.findAll(options),
    );
  }

  @Get('/me')
  async findMe(
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseProfileDto> {
    if (!req?.user?.id) {
      throw new UnauthorizedException();
    }
    return toDto(
      ResponseProfileDto,
      await this.profileService.findOneById(req?.user?.id),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
  ): Promise<ResponseProfileDto | null> {
    return toDto(ResponseProfileDto, await this.profileService.findOneById(id));
  }

  @Put(':id')
  @LogEvent(EventType.PROFILE_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseProfileDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseProfileDto,
      await this.profileService.update(id, updateProfileDto),
    );
  }
}
