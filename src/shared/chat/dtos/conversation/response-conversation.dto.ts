import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseMessageDto } from '../message/response-message.dto';
import { ResponseConversationUserDto } from '../conversation-user/response-conversation-user.dto';

export class ResponseConversationDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: [ResponseConversationUserDto] })
  @Expose()
  @Type(() => ResponseConversationUserDto)
  participants: ResponseConversationUserDto[];

  @ApiProperty({ type: [ResponseMessageDto] })
  @Expose()
  @Type(() => ResponseMessageDto)
  messages: ResponseMessageDto[];

  @ApiProperty({ type: ResponseMessageDto, nullable: true })
  @Expose()
  @Type(() => ResponseMessageDto)
  lastMessage: ResponseMessageDto;

  @Exclude()
  participantsIdentifiers: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  locked: boolean;
}
