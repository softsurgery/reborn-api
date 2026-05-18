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
import { CreateConversationDto } from '../dtos/conversation/create-conversation.dto';

@ApiTags('current-conversation')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/current-conversation',
})
export class CurrentConversationController {
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

  @Get(':id')
  async findOneById(
    @Param('id') id: number,
    @Query() query: IQueryObject,
  ): Promise<ResponseConversationDto | null> {
    return toDto(
      ResponseConversationDto,
      await this.conversationService.findOneById(id, query?.join),
    );
  }

  @Post()
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseConversationDto> {
    const conversation = await this.conversationService.createConversation(
      createConversationDto.users[0],
      req?.user?.sub,
    );
    return toDto(ResponseConversationDto, conversation);
  }
}
