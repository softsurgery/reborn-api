import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationType } from '../enums/notification-type.enum';
import { UserEntity } from 'src/modules/user-management/entities/user.entity';

@Entity('notification')
export class NotificationEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: NotificationType, nullable: true })
  type: NotificationType;

  @ManyToOne(() => UserEntity, (user) => user.notifications, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: true })
  userId?: number;

  @Column({ type: 'json', nullable: true })
  payload?: object;
}
