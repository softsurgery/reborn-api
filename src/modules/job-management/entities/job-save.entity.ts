import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobEntity } from './job.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Entity('job_saves')
export class JobSaveEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jobId: string;

  @Column()
  userId: string;

  @ManyToOne(() => JobEntity, (job) => job.views, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'jobId' })
  job: JobEntity;

  @ManyToOne(() => UserEntity, (user) => user.views, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;
}
