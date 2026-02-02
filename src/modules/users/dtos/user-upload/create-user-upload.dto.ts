import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateUserUploadDto {
  @ApiProperty({ type: String })
  @IsNumber()
  userId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  uploadId?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  order: number;
}
