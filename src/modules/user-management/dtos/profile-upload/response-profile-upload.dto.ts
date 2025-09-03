import { ApiProperty } from '@nestjs/swagger';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { Expose, Type } from 'class-transformer';
import { ResponseUploadDto } from 'src/shared/uploads/dtos/response-upload.dto';
import { ResponseProfileDto } from '../profile/response-profile.dto';

export class ResponseProfileUploadDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: Number })
  @Expose()
  profileId: number;

  @ApiProperty({ type: () => ResponseProfileDto })
  @Expose()
  @Type(() => ResponseProfileDto)
  profile?: ResponseProfileDto;

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
