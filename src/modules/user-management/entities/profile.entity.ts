import { UserEntity } from 'src/modules/user-management/entities/user.entity';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from '../enums/gender.enum';
import { UploadEntity } from 'src/shared/uploads/entities/upload.entity';
import { ProfileUploadEntity } from './profile-upload.entity';
import {
  Education,
  Experience,
} from '../modules/profile-management/interfaces/walk-of-life.interface';
import { RefParamEntity } from 'src/shared/reference-types/entities/ref-param.entity';

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

  @ManyToOne(() => RefParamEntity, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'regionId' })
  region?: RefParamEntity;

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

  @Column({ nullable: true, type: 'json' })
  experiences: Experience[];

  @Column({ nullable: true, type: 'json' })
  educations: Education[];

  @ManyToMany(() => RefParamEntity, {
    cascade: true,
  })
  @JoinTable({
    name: 'profile_skills',
    joinColumn: { name: 'profileId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skillId', referencedColumnName: 'id' },
  })
  skills: RefParamEntity[];

  @ManyToOne(() => UploadEntity, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'officialDocumentId' })
  officialDocument?: UploadEntity;

  @Column({ nullable: true })
  officialDocumentId?: number;

  @ManyToOne(() => UploadEntity, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'driverLicenseDocumentId' })
  driverLicenseDocument?: UploadEntity;

  @Column({ nullable: true })
  driverLicenseDocumentId?: number;
}
