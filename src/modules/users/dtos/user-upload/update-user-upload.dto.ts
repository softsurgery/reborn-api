import { PartialType } from '@nestjs/mapped-types';
import { CreateUserUploadDto } from './create-user-upload.dto';

export class UpdateUserUploadDto extends PartialType(CreateUserUploadDto) {}
