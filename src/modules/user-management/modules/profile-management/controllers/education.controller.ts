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
import { EducationService } from '../services/education.service';
import { ResponseEducationDto } from '../dtos/education/response-education.dto';
import { CreateEducationDto } from '../dtos/education/create-education.dto';
import { UpdateEducationDto } from '../dtos/education/update-education.dto';

@ApiTags('education')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/education',
})
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseEducationDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseEducationDto>> {
    const paginated = await this.educationService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseEducationDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseEducationDto[]> {
    return toDtoArray(
      ResponseEducationDto,
      await this.educationService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
  ): Promise<ResponseEducationDto | null> {
    return toDto(
      ResponseEducationDto,
      await this.educationService.findOneById(id),
    );
  }

  @Post()
  @LogEvent(EventType.ROLE_CREATE)
  async create(
    @Body() createEducationDto: CreateEducationDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseEducationDto> {
    const education = await this.educationService.save(createEducationDto);
    req.logInfo = { id: education.id, degree: education.degree };
    return toDto(ResponseEducationDto, education);
  }

  @Put(':id')
  @LogEvent(EventType.ROLE_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseEducationDto | null> {
    const education = await this.educationService.update(
      id,
      updateEducationDto,
    );
    req.logInfo = { id, degree: education?.degree };
    return toDto(ResponseEducationDto, education);
  }

  @Delete(':id')
  @LogEvent(EventType.ROLE_DELETE)
  async delete(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseEducationDto | null> {
    const education = await this.educationService.softDelete(id);
    req.logInfo = { id, degree: education?.degree };
    return toDto(ResponseEducationDto, education);
  }
}
