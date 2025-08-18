import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JobEntity } from './job.entity';

@Entity('job-tags')
export class JobTagEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  label: string;

  @ManyToMany(() => JobEntity, (job) => job.jobTags)
  jobs: JobEntity[];
}
