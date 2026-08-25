import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseRefParamDto } from '../ref-param/response-ref-param.dto';

export class ResponseRefTypeDto extends ResponseDtoHelper {
  @ApiProperty({ type: String, example: 'skill' })
  @Expose()
  id: string;

  @ApiProperty({ type: String, example: 'label' })
  @Expose()
  label: string;

  @ApiProperty({ type: String, example: 'description' })
  @Expose()
  description: string;

  @ApiProperty({ type: [ResponseRefParamDto] })
  @Expose()
  @Type(() => ResponseRefParamDto)
  refParams?: ResponseRefParamDto[];

  @ApiProperty({ type: ResponseRefTypeDto })
  @Expose()
  @Type(() => ResponseRefTypeDto)
  parent?: ResponseRefTypeDto;

  @ApiProperty({ type: String })
  @Expose()
  parentId?: string;

  @ApiProperty({ type: [ResponseRefTypeDto] })
  @Expose()
  @Type(() => ResponseRefTypeDto)
  children: ResponseRefTypeDto[];
}
