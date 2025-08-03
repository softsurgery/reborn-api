import { ProfileEntity } from 'src/modules/user-management/entities/profile.entity';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('regions')
export class RegionEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  label: string;

  @OneToMany(() => ProfileEntity, (profile) => profile.region)
  profiles: ProfileEntity[];
}
