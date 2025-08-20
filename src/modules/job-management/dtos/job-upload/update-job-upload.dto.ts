import { PartialType } from '@nestjs/mapped-types';
import { CreateJobUploadDto } from './create-job-upload.dto';

export class UpdateJobUploadDto extends PartialType(CreateJobUploadDto) {}
