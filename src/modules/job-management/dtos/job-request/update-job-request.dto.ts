import { PartialType } from '@nestjs/mapped-types';
import { CreateJobRequestDto } from './create-job-request.dto';

export class UpdateJobRequestDto extends PartialType(CreateJobRequestDto) {}
