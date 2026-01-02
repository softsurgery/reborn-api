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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
import { ResponseExperienceDto } from '../dtos/experience/response-experience.dto';
import { CreateExperienceDto } from '../dtos/experience/create-experience.dto';
import { UpdateExperienceDto } from '../dtos/experience/update-experience.dto';
import { ExperienceService } from '../services/experience.service';

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

  @Get('/list')
  @ApiPaginatedResponse(ResponseExperienceDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseExperienceDto>> {
    const paginated = await this.experienceService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseExperienceDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseExperienceDto[]> {
    return toDtoArray(
      ResponseExperienceDto,
      await this.experienceService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
  ): Promise<ResponseExperienceDto | null> {
    return toDto(
      ResponseExperienceDto,
      await this.experienceService.findOneById(id),
    );
  }

  @Post()
  @LogEvent(EventType.EXPERIENCE_CREATE)
  async create(
    @Body() createExperienceDto: CreateExperienceDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseExperienceDto> {
    const experience = await this.experienceService.save(createExperienceDto);
    req.logInfo = { id: experience.id, title: experience.title };
    return toDto(ResponseExperienceDto, experience);
  }

  @Put(':id')
  @LogEvent(EventType.EXPERIENCE_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseExperienceDto | null> {
    const experience = await this.experienceService.update(
      id,
      updateExperienceDto,
    );
    req.logInfo = { id, title: experience?.title };
    return toDto(ResponseExperienceDto, experience);
  }

  @Delete(':id')
  @LogEvent(EventType.EXPERIENCE_DELETE)
  async delete(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseExperienceDto | null> {
    const experience = await this.experienceService.softDelete(id);
    req.logInfo = { id, title: experience?.title };
    return toDto(ResponseExperienceDto, experience);
  }
}
