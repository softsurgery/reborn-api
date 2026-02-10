import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ConversationService } from '../services/conversation.service';
import { ResponseConversationDto } from '../dtos/conversation/response-conversation.dto';
import { AdvancedRequest } from 'src/types';
import { ComposeConversationDto } from '../dtos/conversation/compose-conversation.dto';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';

@ApiTags('conversation')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/conversation',
})
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseConversationDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
    @Request() req: AdvancedRequest,
  ): Promise<PageDto<ResponseConversationDto>> {
    const paginated =
      await this.conversationService.findPaginatedUserConversations(
        query,
        req?.user?.sub,
      );
    return {
      ...paginated,
      data: toDtoArray(ResponseConversationDto, paginated.data),
    };
  }

  @Get('/list/:id')
  @ApiPaginatedResponse(ResponseConversationDto)
  async findAllUserPaginated(
    @Param('id') id: string,
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseConversationDto>> {
    const paginated =
      await this.conversationService.findPaginatedUserConversations(query, id);
    return {
      ...paginated,
      data: toDtoArray(ResponseConversationDto, paginated.data),
    };
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: number,
  ): Promise<ResponseConversationDto | null> {
    return toDto(
      ResponseConversationDto,
      await this.conversationService.findOneById(id),
    );
  }

  @Post('/compose')
  @LogEvent(EventType.CONVERSATION_COMPOSE)
  async composeConversation(
    @Body() body: ComposeConversationDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseConversationDto> {
    req.logInfo = {
      participantIds: body.participantIds,
      composerId: req?.user?.sub,
    };
    return toDto(
      ResponseConversationDto,
      await this.conversationService.composeConversation(body),
    );
  }
}
