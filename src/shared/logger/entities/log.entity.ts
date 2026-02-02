import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { EventType } from '../../../app/enums/event-type.enum';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';

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

  @ManyToOne(() => AbstractUserEntity, (user) => user.logs, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: AbstractUserEntity;

  @Column({ nullable: true })
  userId?: string;

  @Column({ type: 'json', nullable: true })
  logInfo?: object;
}
