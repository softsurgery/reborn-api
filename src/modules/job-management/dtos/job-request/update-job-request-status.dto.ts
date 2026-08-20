import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { JobRequestEvents } from '../../enums/workflow/job-request-events.enum';

export class UpdateJobRequestStatusDto {
  @ApiProperty({
    enum: JobRequestEvents,
    description: 'The workflow event to trigger on the job request',
  })
  @IsEnum(JobRequestEvents)
  event: JobRequestEvents;
}
