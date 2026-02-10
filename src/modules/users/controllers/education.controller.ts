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
import { EducationService } from '../services/education.service';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
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

  @Get('/user/:id')
  async findAllByUser(
    @Param('id') id: string,
  ): Promise<ResponseEducationDto[]> {
    return toDtoArray(
      ResponseEducationDto,
      await this.educationService.findByUser(id),
    );
  }

  @Post('/user/:id')
  @LogEvent(EventType.USER_ADD_EDUCATION)
  async addEducation(
    @Param('id') id: string,
    @Body() createEducationDto: CreateEducationDto,
    @Req() request: AdvancedRequest,
  ): Promise<ResponseEducationDto> {
    const education = await this.educationService.addEducation(
      id,
      createEducationDto,
    );
    request.logInfo = {
      userId: id,
      educationId: education.id,
      title: education.title,
    };
    return toDto(ResponseEducationDto, education);
  }

  @Put(':id')
  @LogEvent(EventType.USER_UPDATE_EDUCATION)
  async updateEducation(
    @Param('id') id: number,
    @Body() updateEducationDto: UpdateEducationDto,
    @Req() request: AdvancedRequest,
  ): Promise<ResponseEducationDto> {
    const education = await this.educationService.updateEducation(
      id,
      updateEducationDto,
    );
    request.logInfo = {
      userId: education.userId,
      educationId: education.id,
      title: education.title,
    };
    return toDto(ResponseEducationDto, education);
  }

  @Delete(':id')
  @LogEvent(EventType.USER_DELETE_EDUCATION)
  async deleteEducation(
    @Param('id') id: number,
    @Req() request: AdvancedRequest,
  ): Promise<ResponseEducationDto | null> {
    const education = await this.educationService.deleteEducation(id);
    request.logInfo = {
      userId: education?.userId,
      educationId: id,
    };
    return toDto(ResponseEducationDto, education);
  }
}
