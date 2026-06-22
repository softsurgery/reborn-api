import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { JobEvents } from '../../enums/workflow/job-events.enum';

export class UpdateJobStatusDto {
  @ApiProperty({
    enum: JobEvents,
    description: 'The workflow event to trigger on the job',
  })
  @IsEnum(JobEvents)
  event: JobEvents;
}
