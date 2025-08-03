import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../enums/gender.enum';
import { Expose, Type } from 'class-transformer';
import { ResponseRegionDto } from 'src/modules/content/region/dtos/response-region.dto';
import { ResponseUserDto } from 'src/modules/user-management/dtos/user/response-user.dto';

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

  @ApiProperty({ type: () => ResponseRegionDto })
  @Expose()
  @Type(() => ResponseRegionDto)
  region?: ResponseRegionDto;

  @ApiProperty({ type: String })
  regionId?: number;

  @ApiProperty({ type: () => ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  user: ResponseUserDto;
}
