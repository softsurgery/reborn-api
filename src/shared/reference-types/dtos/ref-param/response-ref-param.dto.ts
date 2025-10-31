import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseRefTypeDto } from '../ref-type/response-ref-type.dto';

export class ResponseRefParamDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number, example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ type: String, example: 'label' })
  @Expose()
  label: string;

  @ApiProperty({ type: () => ResponseRefTypeDto })
  @Expose()
  @Type(() => ResponseRefTypeDto)
  refType: ResponseRefTypeDto;

  @ApiProperty({ type: String })
  @Expose()
  refTypeId: number;
}
