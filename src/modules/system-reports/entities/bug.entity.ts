import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BugVariant } from '../enums/bug-variant.enum';
import { DeviceInfoEntity } from './device-info.entity';

@Entity('bugs')
export class BugEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: BugVariant, nullable: false })
  event: BugVariant;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @ManyToOne(() => DeviceInfoEntity, (device) => device.bugs, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'deviceId' })
  device: DeviceInfoEntity;

  @Column({ nullable: true })
  deviceId: number;
}
