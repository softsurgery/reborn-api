import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { RolePermissionEntity } from './role-permission.entity';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';

@Entity('permissions')
export class PermissionEntity extends EntityHelper {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  label: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.permission,
  )
  roles: RolePermissionEntity[];
}
