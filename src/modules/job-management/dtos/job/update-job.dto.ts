import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { JobUploadEntity } from '../../entities/job-upload.entity';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  declare uploads: Pick<JobUploadEntity, 'id' | 'order' | 'uploadId'>[];
}
