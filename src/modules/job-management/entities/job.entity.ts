import { UserEntity } from 'src/modules/user-management/entities/user.entity';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobTagEntity } from './job-tag.entity';

@Entity('jobs')
export class JobEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ nullable: false })
  price: number;

  @ManyToOne(() => UserEntity, (user) => user.postedJobs, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'postedById' })
  postedBy: UserEntity;

  @Column({})
  postedById: string;

  @ManyToMany(() => JobTagEntity, (jobTag) => jobTag.jobs, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'job_job_tags',
    joinColumn: {
      name: 'jobId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'jobTagId',
      referencedColumnName: 'id',
    },
  })
  jobTags: JobTagEntity[];
}
