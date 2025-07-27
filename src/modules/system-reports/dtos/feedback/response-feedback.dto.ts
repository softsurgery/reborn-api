import { ApiProperty } from '@nestjs/swagger';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { Expose, Type } from 'class-transformer';
import { FeedbackCategory } from '../../enums/feedback-category.enum';
import { ResponseDeviceInfoDto } from '../device-info/response-device-info.dto';

export class ResponseFeedbackDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String, enum: FeedbackCategory })
  @Expose()
  category: FeedbackCategory;

  @ApiProperty({ type: String })
  @Expose()
  message: string;

  @ApiProperty({ type: Number })
  @Expose()
  rating?: number;

  @ApiProperty({ type: ResponseDeviceInfoDto })
  @Expose()
  @Type(() => ResponseDeviceInfoDto)
  device: ResponseDeviceInfoDto;

  @ApiProperty({ type: Number })
  @Expose()
  deviceId: number;
}
