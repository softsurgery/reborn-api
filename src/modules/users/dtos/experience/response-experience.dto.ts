import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseUserDto } from '../user/response-user.dto';
import { WorkTypes } from '../../enums/experience.work-type.enum';
import { LocationTypes } from '../../enums/experience.location-type.enum';

export class ResponseExperienceDto extends ResponseDtoHelper {
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
  company?: string;

  @ApiProperty({ type: String })
  @Expose()
  location?: string;

  @ApiProperty({ type: String })
  @Expose()
  workType?: WorkTypes;

  @ApiProperty({ type: String })
  @Expose()
  locationType?: LocationTypes;

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
