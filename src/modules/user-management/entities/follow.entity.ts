import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';

@Entity('follows')
export class FollowEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.following, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followerId' })
  follower: UserEntity;

  @Column()
  followerId: string;

  @ManyToOne(() => UserEntity, (user) => user.followers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followingId' })
  following: UserEntity;

  @Column()
  followingId: string;
}
