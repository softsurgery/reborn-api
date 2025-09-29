import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateJobSaveDto {
  @ApiProperty({ type: String })
  @IsString()
  jobId: string;
}
