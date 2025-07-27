import { ApiProperty } from '@nestjs/swagger';
import {
  DATABASE_CREATED_AT_FIELD_NAME,
  DATABASE_DELETED_AT_FIELD_NAME,
  DATABASE_RESTRICT_DELETE_FIELD_NAME,
  DATABASE_UPDATED_AT_FIELD_NAME,
} from '../constants/database.constant';
import { Expose } from 'class-transformer';

export abstract class ResponseDtoHelper {
  @ApiProperty({ type: Date })
  @Expose()
  [DATABASE_CREATED_AT_FIELD_NAME]?: Date;

  @ApiProperty({ type: Date })
  @Expose()
  [DATABASE_UPDATED_AT_FIELD_NAME]?: Date;

  @ApiProperty({ type: Date })
  [DATABASE_DELETED_AT_FIELD_NAME]?: Date;

  @ApiProperty({ type: Boolean, default: false })
  [DATABASE_RESTRICT_DELETE_FIELD_NAME]?: boolean;
}
