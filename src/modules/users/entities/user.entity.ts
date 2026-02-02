import { JobRequestEntity } from 'src/modules/job-management/entities/job-request.entity';
import { JobViewEntity } from 'src/modules/job-management/entities/job-view.entity';
import { JobEntity } from 'src/modules/job-management/entities/job.entity';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { FollowEntity } from 'src/modules/users/entities/follow.entity';
import { Gender } from 'src/shared/abstract-user-management/enums/gender.enum';
import { ChildEntity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserUploadEntity } from './user-upload.entity';
import { RefParamEntity } from 'src/shared/reference-types/entities/ref-param.entity';
import { ExperienceEntity } from './experience.entity';
import { EducationEntity } from './education.entity';
import { StorageEntity } from 'src/shared/storage/entities/storage.entity';

@ChildEntity()
export class UserEntity extends AbstractUserEntity {
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

  @ManyToOne(() => StorageEntity, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'pictureId' })
  picture?: StorageEntity;

  @Column({ nullable: true })
  pictureId?: number;

  @OneToMany(() => UserUploadEntity, (upload) => upload.user, {
    eager: true,
  })
  uploads: UserUploadEntity[];

  @OneToMany(() => ExperienceEntity, (experience) => experience.user, {})
  experiences: ExperienceEntity[];

  @OneToMany(() => EducationEntity, (education) => education.user, {})
  educations: EducationEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.follower)
  following: FollowEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.following)
  followers: FollowEntity[];

  @OneToMany(() => JobEntity, (job) => job.postedBy)
  postedJobs: JobEntity[];

  @OneToMany(() => JobRequestEntity, (request) => request.job)
  requests: JobRequestEntity[];

  @OneToMany(() => JobViewEntity, (view) => view.user)
  views: JobViewEntity[];
}
