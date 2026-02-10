import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobEntity } from './job.entity';
import { StorageEntity } from 'src/shared/storage/entities/storage.entity';

@Entity('job_uploads')
export class JobUploadEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jobId: string;

  @Column()
  uploadId: number;

  @ManyToOne(() => JobEntity, (job) => job.uploads, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'jobId' })
  job: JobEntity;

  @ManyToOne(() => StorageEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'uploadId' })
  upload?: StorageEntity;

  @Column({ nullable: false })
  order: number;
}
