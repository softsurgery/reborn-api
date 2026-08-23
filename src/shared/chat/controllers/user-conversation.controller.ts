import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ConversationService } from '../services/conversation.service';
import { ChatGateway } from '../gateways/chat.gateway';
import { ResponseConversationDto } from '../dtos/conversation/response-conversation.dto';
import { AdvancedRequest } from 'src/types';
import { CreateConversationDto } from '../dtos/conversation/create-conversation.dto';
import { CreateConversationReportDto } from '../dtos/conversation/create-conversation-report.dto';

@ApiTags('current-conversation')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/current-conversation',
})
export class CurrentConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @ApiOperation({
    description: 'Find all paginated conversations of the current user',
    summary: 'Find all paginated conversations of the current user',
  })
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

  @ApiOperation({
    description: 'Find a conversation by its id',
    summary: 'Find a conversation by its id',
  })
  @Get(':id')
  async findOneById(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: IQueryObject,
  ): Promise<ResponseConversationDto | null> {
    const conversation = await this.conversationService.findOneById(
      id,
      query?.join,
    );
    return toDto(ResponseConversationDto, conversation);
  }

  @ApiOperation({
    description: 'Get the number of unread conversations of the current user',
    summary: 'Get the number of unread conversations of the current user',
  })
  @Get('/unread-count')
  async getUnreadCount(
    @Request() req: AdvancedRequest,
  ): Promise<{ count: number }> {
    const count = await this.conversationService.getUnreadConversationCount(
      req?.user?.sub,
    );
    return { count };
  }

  @ApiOperation({
    description:
      'Create a conversation between the current user and another user',
    summary: 'Create a conversation between the current user and another user',
  })
  @Post()
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseConversationDto> {
    const userId = req?.user?.sub;
    const conversation = await this.conversationService.createConversation(
      createConversationDto.users[0],
      userId,
    );

    await this.chatGateway.emitNewConversation(conversation.id, userId);

    const fullConversation = await this.conversationService.findOneById(
      conversation.id,
      'participants,participants.user,lastMessage,lastMessage.uploads',
    );

    return toDto(ResponseConversationDto, fullConversation);
  }

  @ApiOperation({
    description: 'Report a conversation',
    summary: 'Report a conversation',
  })
  @Post(':id/report')
  async reportConversation(
    @Param('id', ParseIntPipe) id: number,
    @Body() createConversationReportDto: CreateConversationReportDto,
    @Request() req: AdvancedRequest,
  ): Promise<void> {
    await this.conversationService.reportConversation(
      id,
      req?.user?.sub,
      createConversationReportDto,
    );
  }

  @ApiOperation({
    description: 'Leave a conversation',
    summary: 'Leave a conversation',
  })
  @Delete(':id')
  async deleteConversation(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AdvancedRequest,
  ): Promise<void> {
    const userId = req?.user?.sub;
    await this.conversationService.leaveConversation(id, userId);
    await this.chatGateway.emitUnreadCountUpdate(userId);
  }
}
