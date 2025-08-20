import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobEntity } from './job.entity';
import { UploadEntity } from 'src/shared/uploads/entities/upload.entity';

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

  @ManyToOne(() => UploadEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'uploadId' })
  upload?: UploadEntity;

  @Column({ nullable: false })
  order: number;
}
