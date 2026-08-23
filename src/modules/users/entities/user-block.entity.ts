import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { UserEntity } from './user.entity';

@Entity('user-blocks')
export class UserBlockEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blockedUserId' })
  blockedUser: UserEntity;

  @Column()
  blockedUserId: string;
}
