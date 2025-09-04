import { RegionEntity } from 'src/modules/content/region/entities/region.entity';
import { UserEntity } from 'src/modules/user-management/entities/user.entity';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from '../enums/gender.enum';
import { UploadEntity } from 'src/shared/uploads/entities/upload.entity';
import { ProfileUploadEntity } from './profile-upload.entity';

@Entity('profiles')
export class ProfileEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, nullable: true })
  phone?: string;

  @Column({ unique: true, nullable: true })
  cin?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @Column({ default: false })
  isPrivate: boolean;

  @ManyToOne(() => RegionEntity, (region) => region.profiles, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'regionId' })
  region?: RegionEntity;

  @Column({ nullable: true })
  regionId?: number;

  @ManyToOne(() => UploadEntity, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'pictureId' })
  picture?: UploadEntity;

  @Column({ nullable: true })
  pictureId?: number;

  @OneToOne(() => UserEntity, (user) => user.profile, {
    cascade: true,
  })
  user: UserEntity;

  @OneToMany(() => ProfileUploadEntity, (upload) => upload.profile, {
    eager: true,
  })
  uploads: ProfileUploadEntity[];
}
