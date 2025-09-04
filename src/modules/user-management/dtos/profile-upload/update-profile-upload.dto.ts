import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileUploadDto } from './create-profile-upload.dto';

export class UpdateProfileUploadDto extends PartialType(
  CreateProfileUploadDto,
) {}
