import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeviceInfoEntity } from './device-info.entity';
import { FeedbackCategory } from '../enums/feedback-category.enum';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Entity('feedback')
export class FeedbackEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'enum', enum: FeedbackCategory, nullable: false })
  category: FeedbackCategory;

  @Column({ nullable: true })
  rating?: number;

  @ManyToOne(() => DeviceInfoEntity, (device) => device.feedbacks, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'deviceId' })
  device: DeviceInfoEntity;

  @Column({})
  deviceId: number;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({})
  userId: string;
}
