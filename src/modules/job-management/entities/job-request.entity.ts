import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobEntity } from './job.entity';
import { UserEntity } from 'src/modules/user-management/entities/user.entity';

@Entity('job-requests')
export class JobRequestEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  jobId: string;

  @ManyToOne(() => JobEntity, (job) => job.requests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'jobId' })
  job: JobEntity;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.requests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
