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
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { FeedbackService } from '../services/feedback.service';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { ResponseFeedbackDto } from '../dtos/feedback/response-feedback.dto';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
import { CreateFeedbackDto } from '../dtos/feedback/create-feedback.dto';
import { RequestWithLogInfo } from 'src/types';

@ApiTags('feedback')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/feedback',
})
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('/list')
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseFeedbackDto>> {
    const paginated = await this.feedbackService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseFeedbackDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseFeedbackDto[]> {
    return toDtoArray(
      ResponseFeedbackDto,
      await this.feedbackService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
  ): Promise<ResponseFeedbackDto | null> {
    return toDto(
      ResponseFeedbackDto,
      await this.feedbackService.findOneById(id),
    );
  }

  @Post()
  @LogEvent(EventType.BUG_CREATE)
  async create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseFeedbackDto> {
    const feedback = await this.feedbackService.save(createFeedbackDto);
    req.logInfo = { id: feedback.id };
    return toDto(ResponseFeedbackDto, feedback);
  }

  @Delete(':id')
  @LogEvent(EventType.BUG_DELETE)
  async delete(
    @Param('id') id: string,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseFeedbackDto | null> {
    req.logInfo = { id };
    return toDto(
      ResponseFeedbackDto,
      await this.feedbackService.softDelete(id),
    );
  }
}
