import { ApiProperty } from '@nestjs/swagger';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { Expose, Type } from 'class-transformer';
import { ResponseJobDto } from '../job/response-job.dto';
import { JobRequestStatus } from '../../enums/job-request-status.enum';
import { ResponseUserDto } from 'src/modules/users/dtos/user/response-user.dto';

export class ResponseJobRequestDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  jobId: string;

  @ApiProperty({ type: () => ResponseJobDto })
  @Expose()
  @Type(() => ResponseJobDto)
  job?: ResponseJobDto;

  @ApiProperty({ type: String })
  @Expose()
  userId: string;

  @ApiProperty({ type: () => ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  user?: ResponseUserDto;

  @ApiProperty({ type: String, enum: JobRequestStatus })
  @Expose()
  status: JobRequestStatus;
}
