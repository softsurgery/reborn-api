import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('device-infos')
export class DeviceInfoEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  model?: string;

  @Column({ nullable: true })
  platform?: string;

  @Column({ nullable: true })
  version?: string;

  @Column({ nullable: true })
  manufacturer?: string;
}
