import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateProfileUploadDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  profileId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  uploadId?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  order: number;
}
