import { ResponseWorkflowDto } from 'src/shared/workflows/dtos/response-workflow.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseJobRequestDto } from './response-job-request.dto';

export class ResponseJobRequestWorkflowDto extends ResponseWorkflowDto {
  @ApiProperty({
    type: ResponseJobRequestDto,
    description: 'The job request details along with its workflow status',
  })
  @Expose()
  @Type(() => ResponseJobRequestDto)
  jobRequest: ResponseJobRequestDto;
}
