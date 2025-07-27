import { ApiProperty } from '@nestjs/swagger';

export class ResponseDeviceInfoDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  model?: string;

  @ApiProperty({ type: String })
  platform?: string;

  @ApiProperty({ type: String })
  version?: string;

  @ApiProperty({ type: String })
  manufacturer?: string;
}
