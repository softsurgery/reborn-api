import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseRoleDto } from '../role/response-role.dto';

export class ResponseAbstractUserDto extends ResponseDtoHelper {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  firstName?: string;

  @ApiProperty({ type: String })
  @Expose()
  lastName?: string;

  @ApiProperty({ type: Date })
  @Expose()
  dateOfBirth?: Date;

  @ApiProperty({ type: Boolean, default: false })
  @Expose()
  isActive?: boolean;

  @ApiProperty({ type: Boolean, default: false })
  @Expose()
  isApproved?: boolean;

  @Exclude()
  password?: string;

  @ApiProperty({ type: String })
  @Expose()
  username: string;

  @ApiProperty({ type: String })
  @Expose()
  email: string;

  @ApiProperty({ type: Date, default: false })
  @Expose()
  emailVerified?: Date;

  @ApiProperty({ type: () => ResponseRoleDto })
  @Expose()
  @Type(() => ResponseRoleDto)
  role: ResponseRoleDto;

  @ApiProperty({ type: String })
  @Expose()
  roleId: string;
}
