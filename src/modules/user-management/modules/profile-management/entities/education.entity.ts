import { ProfileEntity } from 'src/modules/user-management/entities/profile.entity';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class EducationEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  school: string;

  @Column()
  degree: string;

  @Column()
  startYear: number;

  @Column()
  endYear: number;

  @OneToMany(() => ProfileEntity, (profile) => profile.educations)
  profiles: ProfileEntity[];
}
