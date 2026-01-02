import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';

export class ResponseEducationDto extends ResponseDtoHelper {
  @ApiProperty()
  @Expose()
  school: string;

  @ApiProperty()
  @Expose()
  degree: string;

  @ApiProperty()
  @Expose()
  startYear: number;

  @ApiProperty()
  @Expose()
  endYear: number;
}
