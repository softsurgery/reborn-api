import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { ResponseMessageDto } from '../dtos/message/response-message.dto';

@ApiTags('message')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/message',
})
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':id/list')
  @ApiPaginatedResponse(ResponseMessageDto)
  async findPaginatedConversationMessages(
    @Param('id') id: string,
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseMessageDto>> {
    const paginated =
      await this.messageService.findPaginatedConversationMessages(query, id);
    return {
      ...paginated,
      data: toDtoArray(ResponseMessageDto, paginated.data),
    };
  }
}
