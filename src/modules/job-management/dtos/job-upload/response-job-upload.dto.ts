import { ApiProperty } from '@nestjs/swagger';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { Expose, Type } from 'class-transformer';
import { ResponseJobDto } from '../job/response-job.dto';
import { ResponseUploadDto } from 'src/shared/uploads/dtos/response-upload.dto';

export class ResponseJobUploadDto extends ResponseDtoHelper {
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

  @ApiProperty({ type: Number })
  @Expose()
  uploadId: number;

  @ApiProperty({ type: () => ResponseUploadDto })
  @Expose()
  @Type(() => ResponseUploadDto)
  upload?: ResponseUploadDto;

  @ApiProperty({ type: Number })
  @Expose()
  order: number;
}
