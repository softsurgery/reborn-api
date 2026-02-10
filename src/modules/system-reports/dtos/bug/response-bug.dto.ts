import { ApiProperty } from '@nestjs/swagger';
import { BugVariant } from '../../enums/bug-variant.enum';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { Expose, Type } from 'class-transformer';
import { ResponseDeviceInfoDto } from '../device-info/response-device-info.dto';
import { ResponseUserDto } from 'src/modules/users/dtos/user/response-user.dto';

export class ResponseBugDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String, enum: BugVariant })
  @Expose()
  variant: BugVariant;

  @ApiProperty({ type: String })
  @Expose()
  title: string;

  @ApiProperty({ type: String })
  @Expose()
  description: string;

  @ApiProperty({ type: ResponseDeviceInfoDto })
  @Expose()
  @Type(() => ResponseDeviceInfoDto)
  device: ResponseDeviceInfoDto;

  @ApiProperty({ type: Number })
  @Expose()
  deviceId: number;

  @ApiProperty({ type: String })
  @Expose()
  userId: string;

  @ApiProperty({ type: ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  user?: ResponseUserDto;
}
