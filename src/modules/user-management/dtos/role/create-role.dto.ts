import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsArray } from 'class-validator';
import { RolePermissionEntity } from '../../entities/role-permission.entity';

export class CreateRoleDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(3, 50)
  label: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ isArray: true })
  @IsArray()
  permissions: Pick<RolePermissionEntity, 'permissionId'>[];
}
