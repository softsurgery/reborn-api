import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateMessageUploadDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  messageId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  uploadId?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  order: number;
}
