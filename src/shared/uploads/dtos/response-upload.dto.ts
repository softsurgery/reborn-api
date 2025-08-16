import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';

export class ResponseUploadDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  slug: string;

  @ApiProperty({ type: String })
  @Expose()
  filename: string;

  @ApiProperty({ type: String })
  @Expose()
  mimetype: string;

  @ApiProperty({ type: Number })
  @Expose()
  size: number;

  @ApiProperty({ type: Boolean })
  @Expose()
  isTemporary: boolean;

  @ApiProperty({ type: Boolean })
  @Expose()
  isPrivate: boolean;
}
