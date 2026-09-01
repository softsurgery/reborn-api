import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Put,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { toDto } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
import { UserService } from '../services/user.service';
import { UserConfigurationService } from '../services/user-configuration.service';
import { ResponseUserDto } from '../dtos/user/response-user.dto';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { UpdateUserCoverDto } from '../dtos/user/update-user-cover.dto';
import { UpdateUserSkillsDto } from '../dtos/user/update-user-skills.dto';

@ApiTags('current-user')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/current-user',
})
export class CurrentUserController {
  constructor(
    private readonly userService: UserService,
    private readonly userConfigurationService: UserConfigurationService,
  ) {}

  @Get('')
  async findCurrentUser(
    @Request() req: AdvancedRequest,
  ): Promise<ResponseUserDto | null> {
    if (!req?.user?.sub) {
      return null;
    }
    const user = await this.userService.findOneById(req?.user?.sub);
    return toDto(ResponseUserDto, user);
  }

  @Put()
  @LogEvent(EventType.USER_UPDATE)
  async updateCurrentUser(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseUserDto | null> {
    if (!req?.user?.sub) {
      return null;
    }
    return toDto(
      ResponseUserDto,
      await this.userService.extendedUpdate(req?.user?.sub, updateUserDto),
    );
  }

  @Put('/cover')
  @LogEvent(EventType.USER_UPDATE_COVER)
  async updateCurrentUserCover(
    @Body() updateUserCoverDto: UpdateUserCoverDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseUserDto | null> {
    if (!req?.user?.sub) {
      return null;
    }
    const user = await this.userService.updateCover(
      req?.user?.sub,
      updateUserCoverDto.coverId,
    );
    req.logInfo = { id: user?.id, firstName: user?.firstName };
    return toDto(ResponseUserDto, user);
  }

  @Put('/skills')
  @LogEvent(EventType.USER_UPDATE)
  async updateSkills(
    @Body() updateUserSkillsDto: UpdateUserSkillsDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseUserDto | null> {
    if (!req?.user?.sub) {
      return null;
    }
    const user = await this.userService.updateSkills(
      req.user.sub,
      updateUserSkillsDto.skills,
    );
    req.logInfo = { id: user?.id, firstName: user?.firstName };
    return toDto(ResponseUserDto, user);
  }

  @Delete('/')
  @LogEvent(EventType.USER_DELETE)
  async deleteCurrent(
    @Request() req: AdvancedRequest,
  ): Promise<ResponseUserDto | null> {
    if (!req?.user?.sub) {
      return null;
    }
    const user = await this.userService.softDelete(req.user.sub);
    req.logInfo = { id: user?.id, firstName: user?.firstName };
    return toDto(ResponseUserDto, user);
  }

  @Get('/mobile-app-settings')
  async getMobileAppSettings(@Request() req: AdvancedRequest) {
    if (!req?.user?.sub) return null;
    return this.userConfigurationService.getMobileAppSettingsConfiguration(
      req.user.sub,
    );
  }

  @Put('/mobile-app-settings/quick-actions')
  async updateQuickActions(
    @Request() req: AdvancedRequest,
    @Body() body: { activeIds: string[] },
  ) {
    if (!req?.user?.sub) return null;
    return this.userConfigurationService.updateMobileAppSettingsConfiguration(
      req.user.sub,
      body.activeIds,
    );
  }
}
