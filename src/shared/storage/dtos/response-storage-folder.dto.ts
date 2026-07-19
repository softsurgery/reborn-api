import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseStorageDto } from './response-storage.dto';

export class ResponseStorageFolderDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: String, required: false })
  @Expose()
  systematicName?: string;

  @ApiProperty({ type: Number, required: false })
  @Expose()
  parentId?: number;

  @ApiProperty({ type: () => ResponseStorageFolderDto, isArray: true })
  @Expose()
  @Type(() => ResponseStorageFolderDto)
  children?: ResponseStorageFolderDto[];
}

export class ResponseStorageFolderContentsDto {
  @ApiProperty({ type: () => ResponseStorageFolderDto, isArray: true })
  @Expose()
  @Type(() => ResponseStorageFolderDto)
  folders: ResponseStorageFolderDto[];

  @ApiProperty({ type: () => ResponseStorageDto, isArray: true })
  @Expose()
  @Type(() => ResponseStorageDto)
  files: ResponseStorageDto[];
}
