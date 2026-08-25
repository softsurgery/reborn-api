import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateJobRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  jobId: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  proposedPrice?: number;
}
