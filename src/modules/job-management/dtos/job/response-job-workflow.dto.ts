import { ResponseWorkflowDto } from 'src/shared/workflows/dtos/response-workflow.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseJobDto } from './response-job.dto';

export class ResponseJobWorkflowDto extends ResponseWorkflowDto {
  @ApiProperty({
    type: ResponseJobDto,
    description: 'The job details along with its workflow status',
  })
  @Expose()
  @Type(() => ResponseJobDto)
  job: ResponseJobDto;
}
