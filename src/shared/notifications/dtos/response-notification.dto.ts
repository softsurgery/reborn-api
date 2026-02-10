import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { NotificationType } from '../../../app/enums/notification-type.enum';
import { ResponseAbstractUserDto } from 'src/shared/abstract-user-management/dtos/abstract-user/response-abstract-user.dto';

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

  @ApiProperty({ type: ResponseAbstractUserDto })
  @Expose()
  @Type(() => ResponseAbstractUserDto)
  user: ResponseAbstractUserDto;

  @ApiProperty({ type: Object })
  @Expose()
  payload?: unknown;
}
