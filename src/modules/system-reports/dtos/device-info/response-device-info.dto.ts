import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseBugDto } from '../bug/response-bug.dto';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseFeedbackDto } from '../feedback/response-feedback.dto';

export class ResponseDeviceInfoDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  model?: string;

  @ApiProperty({ type: String })
  @Expose()
  platform?: string;

  @ApiProperty({ type: String })
  @Expose()
  version?: string;

  @ApiProperty({ type: String })
  @Expose()
  manufacturer?: string;

  @ApiProperty({ type: ResponseBugDto, isArray: true })
  @Expose()
  @Type(() => ResponseBugDto)
  bugs?: ResponseBugDto[];

  @ApiProperty({ type: ResponseFeedbackDto, isArray: true })
  @Expose()
  @Type(() => ResponseFeedbackDto)
  feedbacks?: ResponseFeedbackDto[];
}
