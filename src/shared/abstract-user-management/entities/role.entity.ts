import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolePermissionEntity } from './role-permission.entity';
import { AbstractUserEntity } from './abstract-user.entity';

@Entity('roles')
export class RoleEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  label: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.role,
  )
  permissions: RolePermissionEntity[];

  @OneToMany(() => AbstractUserEntity, (user) => user.role)
  users: AbstractUserEntity[];
}
