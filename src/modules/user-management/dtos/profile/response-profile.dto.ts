import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../enums/gender.enum';
import { Expose, Type } from 'class-transformer';
import { ResponseUserDto } from 'src/modules/user-management/dtos/user/response-user.dto';
import { ResponseUploadDto } from 'src/shared/uploads/dtos/response-upload.dto';
import { ResponseProfileUploadDto } from '../profile-upload/response-profile-upload.dto';
import { ResponseRefParamDto } from 'src/shared/reference-types/dtos/ref-param/response-ref-param.dto';
import { ResponseEducationDto } from '../../modules/profile-management/dtos/education/response-education.dto';

export class ResponseProfileDto {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  phone?: string;

  @ApiProperty({ type: String })
  @Expose()
  cin?: string;

  @ApiProperty({ type: String })
  @Expose()
  bio?: string;

  @ApiProperty({ type: String, enum: Gender, example: Gender.Male })
  @Expose()
  gender?: Gender;

  @ApiProperty({ type: Boolean, example: false })
  @Expose()
  isPrivate?: boolean;

  @ApiProperty({ type: () => ResponseRefParamDto })
  @Expose()
  @Type(() => ResponseRefParamDto)
  region?: ResponseRefParamDto;

  @ApiProperty({ type: Number })
  @Expose()
  regionId?: number;

  @ApiProperty({ type: Number })
  @Expose()
  pictureId?: number;

  @ApiProperty({ type: ResponseUploadDto })
  @Expose()
  @Type(() => ResponseUploadDto)
  picture?: ResponseUploadDto;

  @ApiProperty({ type: ResponseUploadDto })
  @Expose()
  @Type(() => ResponseUploadDto)
  officialDocument?: ResponseUploadDto;

  @ApiProperty({ type: Number })
  @Expose()
  officialDocumentId?: number;

  @ApiProperty({ type: ResponseUploadDto })
  @Expose()
  @Type(() => ResponseUploadDto)
  driverLicenseDocument?: ResponseUploadDto;

  @ApiProperty({ type: Number })
  @Expose()
  driverLicenseDocumentId?: number;

  @ApiProperty({ type: () => ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  user: ResponseUserDto;

  @ApiProperty({ type: [ResponseProfileUploadDto] })
  @Expose()
  @Type(() => ResponseProfileUploadDto)
  uploads: ResponseProfileUploadDto[];

  // @ApiProperty({ type: [ExperienceDto] })
  // @Expose()
  // @Type(() => ExperienceDto)
  // experiences: [];

  @ApiProperty({ type: [ResponseEducationDto] })
  @Expose()
  @Type(() => ResponseEducationDto)
  educations: ResponseEducationDto[];

  @ApiProperty({ type: [ResponseRefParamDto] })
  @Expose()
  @Type(() => ResponseRefParamDto)
  skills: ResponseRefParamDto[];
}
