import { ApiProperty } from '@nestjs/swagger';

export class UpdateConfigurationParamaterDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  value: string;
}
