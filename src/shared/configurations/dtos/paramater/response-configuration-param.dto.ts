import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseConfigurationNamespaceDto } from '../namespace/response-configuration-namespace.dto';
import { ParamVariant } from '../../enums/param-variant.enum';

export class ResponseConfigurationParamDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  name?: string;

  @ApiProperty({ type: String })
  @Expose()
  description?: string;

  @ApiProperty({ type: () => ResponseConfigurationNamespaceDto })
  @Expose()
  @Type(() => ResponseConfigurationNamespaceDto)
  namespace: ResponseConfigurationNamespaceDto;

  @ApiProperty({ type: String })
  @Expose()
  namespaceId: string;

  @ApiProperty({
    enum: ParamVariant,
    description: 'Variant of the parameter',
    example: ParamVariant.STRING,
  })
  @Expose()
  variant: ParamVariant;

  @ApiProperty({ type: String })
  @Expose()
  value?: string;

  @ApiProperty({ type: Object })
  @Expose()
  options?: { label: string; value: string }[];
}
