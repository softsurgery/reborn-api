import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseAbstractUserDto } from 'src/shared/abstract-user-management/dtos/abstract-user/response-abstract-user.dto';
import { SessionType } from 'src/app/enums/session.enum';

export class ResponseSessionDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number, example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ type: String, example: '1' })
  @Expose()
  userId?: string;

  @ApiProperty({ type: ResponseAbstractUserDto })
  @Expose()
  @Type(() => ResponseAbstractUserDto)
  user: ResponseAbstractUserDto;

  @ApiProperty({ type: String, enum: SessionType })
  @Expose()
  type: SessionType;

  @ApiProperty({ type: Date })
  @Expose()
  planned_start?: Date;

  @ApiProperty({ type: Date })
  @Expose()
  planned_end?: Date;

  @ApiProperty({ type: Date })
  @Expose()
  started?: Date;

  @ApiProperty({ type: Date })
  @Expose()
  ended?: Date;

  @ApiProperty({ type: Object })
  @Expose()
  payload?: object;
}
