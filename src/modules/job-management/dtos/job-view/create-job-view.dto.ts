import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateJobViewDto {
  @ApiProperty({ type: String })
  @IsString()
  jobId: string;
}
