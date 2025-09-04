import { ProfileUploadEntity } from '../../entities/profile-upload.entity';
import { CreateProfileDto } from './create-profile.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  declare uploads: Pick<ProfileUploadEntity, 'id' | 'order' | 'uploadId'>[];
}
