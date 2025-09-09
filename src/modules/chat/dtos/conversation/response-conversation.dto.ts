import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseClientDto } from 'src/modules/user-management/dtos/client/response-client.dto';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseMessageDto } from '../message/response-message.dto';

export class ResponseConversationDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: [ResponseClientDto] })
  @Expose()
  @Type(() => ResponseClientDto)
  participants: ResponseClientDto[];

  @ApiProperty({ type: [ResponseMessageDto] })
  @Expose()
  @Type(() => ResponseMessageDto)
  messages: ResponseMessageDto[];
}
