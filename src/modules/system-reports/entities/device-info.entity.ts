import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BugEntity } from './bug.entity';
import { FeedbackEntity } from './feedback.entity';

@Entity('device-infos')
export class DeviceInfoEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  model?: string;

  @Column({ nullable: true })
  platform?: string;

  @Column({ nullable: true })
  version?: string;

  @Column({ nullable: true })
  manufacturer?: string;

  @OneToMany(() => BugEntity, (bug) => bug.device)
  bugs?: BugEntity[];

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.device)
  feedbacks?: FeedbackEntity[];
}
