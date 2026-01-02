import { ProfileEntity } from 'src/modules/user-management/entities/profile.entity';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class ExperienceEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  description: string;

  @OneToMany(() => ProfileEntity, (profile) => profile.educations)
  profiles: ProfileEntity[];
}
