import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';

@Entity('role_permissions')
export class RolePermissionEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleId: string;

  @Column()
  permissionId: string;

  @ManyToOne(() => RoleEntity, (role) => role.permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, (permission) => permission.roles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permissionId' })
  permission?: PermissionEntity;
}
