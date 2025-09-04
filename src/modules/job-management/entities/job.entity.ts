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
import { CurrencyEntity } from 'src/modules/content/currency/entities/currency.entity';
import { JobUploadEntity } from './job-upload.entity';
import { JobCategoryEntity } from './job-category.entity';
import { JobStyle } from '../enums/job-style.enum';
import { JobRequestEntity } from './job-request.entity';

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

  @ManyToOne(() => CurrencyEntity, (currency) => currency.jobs, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'currencyId' })
  currency: CurrencyEntity;

  @Column({})
  currencyId: string;

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

  @Column({})
  categoryId: number;

  @OneToMany(() => JobUploadEntity, (jobUpload) => jobUpload.job)
  uploads: JobUploadEntity[];

  @OneToMany(() => JobRequestEntity, (request) => request.job)
  requests: JobRequestEntity[];
}
