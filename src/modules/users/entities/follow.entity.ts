import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { UserEntity } from './user.entity';

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
