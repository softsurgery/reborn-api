import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { LogEntity } from 'src/shared/logger/entities/log.entity';
import { ProfileEntity } from 'src/modules/user-management/entities/profile.entity';
import { JobEntity } from 'src/modules/job-management/entities/job.entity';
import { FollowEntity } from './follow.entity';
import { JobRequestEntity } from 'src/modules/job-management/entities/job-request.entity';
import { JobViewEntity } from 'src/modules/job-management/entities/job-view.entity';
import { NotificationEntity } from 'src/shared/notifications/entities/notification.entity';

@Entity('users')
export class UserEntity extends EntityHelper {
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

  @OneToOne(() => ProfileEntity, (profile) => profile.user, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'profileId' })
  profile?: ProfileEntity;

  @Column()
  profileId: number;

  @OneToMany(() => JobEntity, (job) => job.postedBy)
  postedJobs: JobEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.follower)
  following: FollowEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.following)
  followers: FollowEntity[];

  @OneToMany(() => JobRequestEntity, (request) => request.job)
  requests: JobRequestEntity[];

  @OneToMany(() => JobViewEntity, (view) => view.user)
  views: JobViewEntity[];
}
