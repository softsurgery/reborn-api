import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseRefParamDto } from '../ref-param/response-ref-param.dto';

export class ResponseRefTypeDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number, example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ type: String, example: 'label' })
  @Expose()
  label: string;

  @ApiProperty({ type: String, example: 'description' })
  @Expose()
  description: string;

  @ApiProperty({ type: [ResponseRefParamDto] })
  @Expose()
  @Type(() => ResponseRefParamDto)
  refParams: ResponseRefParamDto[];

  @ApiProperty({ type: ResponseRefTypeDto })
  @Expose()
  @Type(() => ResponseRefParamDto)
  parent: ResponseRefTypeDto;

  @ApiProperty({ type: Number, example: 1 })
  @Expose()
  parentId: number;

  @ApiProperty({ type: [ResponseRefTypeDto] })
  @Expose()
  @Type(() => ResponseRefParamDto)
  children: ResponseRefTypeDto[];
}
