import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/user-management/entities/user.entity';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { EventType } from '../enums/event-type.enum';

@Entity('log')
export class LogEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: EventType, nullable: true })
  event: EventType;

  @Column({ nullable: true })
  api?: string;

  @Column({ nullable: true })
  method?: string;

  @ManyToOne(() => UserEntity, (user) => user.logs, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: true })
  userId?: number;

  @Column({ type: 'json', nullable: true })
  logInfo?: object;
}
