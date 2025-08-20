import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateJobUploadDto {
  @ApiProperty({ type: String })
  @IsString()
  jobId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  uploadId?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  order: number;
}
