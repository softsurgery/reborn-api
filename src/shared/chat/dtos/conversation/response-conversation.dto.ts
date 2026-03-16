import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseMessageDto } from '../message/response-message.dto';
import { ResponseUserDto } from 'src/modules/users/dtos/user/response-user.dto';

export class ResponseConversationDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: [ResponseUserDto] })
  @Expose()
  @Type(() => ResponseUserDto)
  participants: ResponseUserDto[];

  @ApiProperty({ type: [ResponseMessageDto] })
  @Expose()
  @Type(() => ResponseMessageDto)
  messages: ResponseMessageDto[];
}
