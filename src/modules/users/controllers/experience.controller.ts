import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { ExperienceService } from '../services/experience.service';
import { ResponseExperienceDto } from '../dtos/experience/response-experience.dto';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { CreateExperienceDto } from '../dtos/experience/create-experience.dto';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
import { UpdateExperienceDto } from '../dtos/experience/update-experience.dto';

@ApiTags('experience')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/experience',
})
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get('/user/:id')
  async findAllByUser(
    @Param('id') id: string,
  ): Promise<ResponseExperienceDto[]> {
    return toDtoArray(
      ResponseExperienceDto,
      await this.experienceService.findByUser(id),
    );
  }

  @Post('/user/:id')
  @LogEvent(EventType.USER_ADD_EXPERIENCE)
  async addExperience(
    @Param('id') id: string,
    @Body() createExperienceDto: CreateExperienceDto,
    @Req() request: AdvancedRequest,
  ): Promise<ResponseExperienceDto> {
    const experience = await this.experienceService.addExperience(
      id,
      createExperienceDto,
    );
    request.logInfo = {
      userId: id,
      experienceId: experience.id,
      title: experience.title,
    };
    return toDto(ResponseExperienceDto, experience);
  }

  @Put(':id')
  @LogEvent(EventType.USER_UPDATE_EXPERIENCE)
  async updateExperience(
    @Param('id') id: number,
    @Body() updateExperienceDto: UpdateExperienceDto,
    @Req() request: AdvancedRequest,
  ): Promise<ResponseExperienceDto> {
    const experience = await this.experienceService.updateExperience(
      id,
      updateExperienceDto,
    );
    request.logInfo = {
      userId: experience.userId,
      experienceId: experience.id,
      title: experience.title,
    };
    return toDto(ResponseExperienceDto, experience);
  }

  @Delete(':id')
  @LogEvent(EventType.USER_DELETE_EXPERIENCE)
  async deleteExperience(
    @Param('id') id: number,
    @Req() request: AdvancedRequest,
  ): Promise<ResponseExperienceDto | null> {
    const experience = await this.experienceService.deleteExperience(id);
    request.logInfo = {
      userId: experience?.userId,
      experienceId: id,
    };
    return toDto(ResponseExperienceDto, experience);
  }
}
