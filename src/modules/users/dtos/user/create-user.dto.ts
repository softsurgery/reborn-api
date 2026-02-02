import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CreateAbstractUserDto } from 'src/shared/abstract-user-management/dtos/abstract-user/create-abstract-user.dto';
import { Gender } from 'src/shared/abstract-user-management/enums/gender.enum';
import { UserUploadEntity } from '../../entities/user-upload.entity';

export class CreateUserDto extends CreateAbstractUserDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(8, 20)
  @IsOptional()
  phone?: string;

  @ApiProperty({ type: String })
  @IsString()
  @Length(8, 8)
  @IsOptional()
  cin?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ type: String, enum: Gender, example: Gender.Male })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  regionId?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  pictureId?: number;

  @ApiProperty({ isArray: true, description: 'ID of uploaded file' })
  @IsArray()
  uploads?: Pick<UserUploadEntity, 'uploadId'>[];
}
