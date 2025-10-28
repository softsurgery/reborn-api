import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { NotificationType } from '../enums/notification-type.enum';
import { ResponseUserDto } from 'src/modules/user-management/dtos/user/response-user.dto';

export class ResponseNotificationDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({
    type: String,
    enum: NotificationType,
    example: NotificationType.TEST,
  })
  @Expose()
  type: NotificationType;

  @ApiProperty({ type: String, example: '1' })
  @Expose()
  userId?: string;

  @ApiProperty({ type: ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  user: ResponseUserDto;

  @ApiProperty({ type: Object })
  @Expose()
  payload?: unknown;
}
