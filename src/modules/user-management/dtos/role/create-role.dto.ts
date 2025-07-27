import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsArray } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(3, 50)
  label: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: String })
  @IsArray()
  permissions: { permissionId: string }[];
}
