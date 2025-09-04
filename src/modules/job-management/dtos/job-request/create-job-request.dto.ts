import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateJobRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  jobId: string;
}
