import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { LogEntity } from 'src/shared/logger/entities/log.entity';
import { NotificationEntity } from 'src/shared/notifications/entities/notification.entity';
import { SessionEntity } from 'src/shared/sessions/entities/session.entity';

@Entity('users')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class AbstractUserEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: 'datetime', nullable: true })
  dateOfBirth?: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true })
  password?: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'timestamp', nullable: true })
  emailVerified?: Date;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => RoleEntity, (role) => role.users, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @Column({})
  roleId: string;

  @OneToMany(() => LogEntity, (log) => log.user)
  logs?: LogEntity[];

  @OneToMany(() => NotificationEntity, (notif) => notif.user)
  notifications?: NotificationEntity[];

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions?: SessionEntity[];
}
