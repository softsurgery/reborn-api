import { UpdateUserDto } from 'src/modules/user-management/dtos/user/update-user.dto';
import { CreateProfileDto } from './create-profile.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiProperty({ type: UpdateUserDto })
  user: UpdateUserDto;
}
