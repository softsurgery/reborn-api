import { PartialType } from '@nestjs/swagger';
import { CreateJobTagDto } from './create-job-tag.dto';

export class UpdateJobTagDto extends PartialType(CreateJobTagDto) {}
