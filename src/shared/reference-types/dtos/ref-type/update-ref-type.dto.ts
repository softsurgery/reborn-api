import { PartialType } from '@nestjs/mapped-types';
import { CreateRefTypeDto } from './create-ref-type.dto';

export class UpdateRefTypeDto extends PartialType(CreateRefTypeDto) {}
