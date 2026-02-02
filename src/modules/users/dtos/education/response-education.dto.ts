import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseUserDto } from '../user/response-user.dto';

export class ResponseEducationDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  title?: string;

  @ApiProperty({ type: Date })
  @Expose()
  startDate?: Date;

  @ApiProperty({ type: Date })
  @Expose()
  endDate?: Date;

  @ApiProperty({ type: String })
  @Expose()
  institution?: string;

  @ApiProperty({ type: String })
  @Expose()
  description?: string;

  @ApiProperty({ type: () => ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  user: ResponseUserDto;

  @ApiProperty({ type: String })
  @Expose()
  userId: string;
}
