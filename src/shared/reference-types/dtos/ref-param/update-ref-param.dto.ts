import { PartialType } from '@nestjs/mapped-types';
import { CreateRefParamDto } from './create-ref-param.dto';

export class UpdateRefParamDto extends PartialType(CreateRefParamDto) {}
