import { ApiProperty } from '@nestjs/swagger';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseConversationDto } from '../conversation/response-conversation.dto';
import { Expose, Type } from 'class-transformer';
import { ResponseUserDto } from 'src/modules/user-management/dtos/user/response-user.dto';

export class ResponseMessageDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  content: string;

  @ApiProperty({ type: Number })
  @Expose()
  conversationId: number;

  @ApiProperty({ type: ResponseConversationDto })
  @Expose()
  @Type(() => ResponseConversationDto)
  conversation: ResponseConversationDto;

  @ApiProperty({ type: String })
  @Expose()
  userId: string;

  @ApiProperty({ type: ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  user: ResponseUserDto;
}
