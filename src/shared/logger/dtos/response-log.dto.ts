import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { EventType } from '../enums/event-type.enum';
import { ResponseUserDto } from 'src/modules/user-management/dtos/user/response-user.dto';

export class ResponseLogDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number, example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ type: String, enum: EventType, example: EventType.SIGNIN })
  @Expose()
  event: EventType;

  @ApiProperty({ type: String, example: '/api/v1/user/list' })
  @Expose()
  api?: string;

  @ApiProperty({ type: String, example: 'GET' })
  @Expose()
  method?: string;

  @ApiProperty({ type: String, example: '1' })
  @Expose()
  userId?: string;

  @ApiProperty({ type: ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  user: ResponseUserDto;

  @ApiProperty({ type: Object })
  @Expose()
  logInfo?: unknown;
}
