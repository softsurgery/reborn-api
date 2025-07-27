import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(3, 50)
  label: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  description?: string;
}
