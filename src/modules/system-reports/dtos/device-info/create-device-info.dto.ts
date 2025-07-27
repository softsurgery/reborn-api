import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateDeviceInfoDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  manufacturer?: string;
}
