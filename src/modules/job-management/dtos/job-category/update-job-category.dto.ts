import { PartialType } from '@nestjs/swagger';
import { CreateJobCategoryDto } from './create-job-category.dto';

export class UpdateJobCategoryDto extends PartialType(CreateJobCategoryDto) {}
