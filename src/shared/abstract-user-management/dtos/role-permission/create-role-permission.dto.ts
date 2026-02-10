import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRolePermissionDto {
  @ApiProperty({ type: String })
  @IsString()
  roleId: string;

  @ApiProperty({ type: String })
  @IsString()
  permissionId?: string;
}
