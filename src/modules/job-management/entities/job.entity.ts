import { UserEntity } from 'src/modules/user-management/entities/user.entity';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobTagEntity } from './job-tag.entity';
import { JobUploadEntity } from './job-upload.entity';
import { JobCategoryEntity } from './job-category.entity';
import { JobStyle } from '../enums/job-style.enum';
import { JobRequestEntity } from './job-request.entity';
import { JobDifficulty } from '../enums/job-difficulty.enum';
import { JobViewEntity } from './job-view.entity';
import { JobSaveEntity } from './job-save.entity';
import { RefParamEntity } from 'src/shared/reference-types/entities/ref-param.entity';

@Entity('jobs')
export class JobEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'float', nullable: false })
  price: number;

  @ManyToOne(() => RefParamEntity, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'currencyId' })
  currency: RefParamEntity;

  @Column({})
  currencyId: number;

  @ManyToOne(() => UserEntity, (user) => user.postedJobs, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'postedById' })
  postedBy: UserEntity;

  @Column({})
  postedById: string;

  @ManyToMany(() => JobTagEntity, (tag) => tag.jobs, {
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
  tags: JobTagEntity[];

  @ManyToOne(() => JobCategoryEntity, (category) => category.jobs, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: JobCategoryEntity;

  @Column({ type: 'enum', enum: JobStyle, nullable: false })
  style: JobStyle;

  @Column({ type: 'enum', enum: JobDifficulty, nullable: false })
  difficulty: JobDifficulty;

  @Column({})
  categoryId: number;

  @OneToMany(() => JobUploadEntity, (jobUpload) => jobUpload.job, {
    eager: true,
  })
  uploads: JobUploadEntity[];

  @OneToMany(() => JobRequestEntity, (request) => request.job)
  requests: JobRequestEntity[];

  @OneToMany(() => JobViewEntity, (view) => view.job)
  views: JobViewEntity[];

  @OneToMany(() => JobSaveEntity, (save) => save.job)
  saves: JobSaveEntity[];
}
