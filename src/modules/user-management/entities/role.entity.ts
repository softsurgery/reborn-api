import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { RolePermissionEntity } from './role-permission.entity';

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

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
