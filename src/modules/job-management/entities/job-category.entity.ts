import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JobEntity } from './job.entity';

@Entity('job-category')
export class JobCategoryEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  label: string;

  @OneToMany(() => JobEntity, (job) => job.category)
  jobs: JobEntity[];
}
