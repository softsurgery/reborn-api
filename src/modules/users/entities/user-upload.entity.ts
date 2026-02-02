import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StorageEntity } from 'src/shared/storage/entities/storage.entity';
import { UserEntity } from './user.entity';

@Entity('user_uploads')
export class UserUploadEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  uploadId: number;

  @ManyToOne(() => UserEntity, (user) => user.uploads, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => StorageEntity, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'uploadId' })
  upload?: StorageEntity;

  @Column({ nullable: false })
  order: number;
}
