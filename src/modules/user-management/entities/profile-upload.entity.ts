import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { UploadEntity } from 'src/shared/uploads/entities/upload.entity';

@Entity('profile_uploads')
export class ProfileUploadEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profileId: number;

  @Column()
  uploadId: number;

  @ManyToOne(() => ProfileEntity, (profile) => profile.uploads, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profileId' })
  profile: ProfileEntity;

  @ManyToOne(() => UploadEntity, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'uploadId' })
  upload?: UploadEntity;

  @Column({ nullable: false })
  order: number;
}
