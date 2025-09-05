import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { ProfileEntity } from '../entities/profile.entity';
import { ProfileNotFoundException } from '../errors/profile/profile.notfound.error';
import { CreateProfileDto } from '../dtos/profile/create-profile.dto';
import { UpdateProfileDto } from '../dtos/profile/update-profile.dto';
import { ProfileRepository } from '../repositories/profile.repository';
import { UploadService } from 'src/shared/uploads/services/upload.service';
import { ProfileUploadService } from './profile-upload.service';
import { ProfileUploadEntity } from '../entities/profile-upload.entity';
import { CreateProfileUploadDto } from '../dtos/profile-upload/create-profile-upload.dto';
import { UpdateProfileUploadDto } from '../dtos/profile-upload/update-profile-upload.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly profileUploadService: ProfileUploadService,
    private readonly uploadService: UploadService,
  ) {}

  async findOneById(id: number): Promise<ProfileEntity> {
    const profile = await this.profileRepository.findOneById(id);
    if (!profile) {
      throw new ProfileNotFoundException();
    }
    return profile;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<ProfileEntity | null> {
    const queryBuilder = new QueryBuilder(this.profileRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const profile = await this.profileRepository.findOne(
      queryOptions as FindOneOptions<ProfileEntity>,
    );
    return profile;
  }

  async findAll(query: IQueryObject): Promise<ProfileEntity[]> {
    const queryBuilder = new QueryBuilder(this.profileRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const profiles = await this.profileRepository.findAll(
      queryOptions as FindManyOptions<ProfileEntity>,
    );
    return profiles;
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<ProfileEntity>> {
    const queryBuilder = new QueryBuilder(this.profileRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.profileRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.profileRepository.findAll(
      queryOptions as FindManyOptions<ProfileEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: Number(query.page),
        take: Number(query.limit),
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  @Transactional()
  async save(createProfileDto: CreateProfileDto): Promise<ProfileEntity> {
    return await this.profileRepository.save(createProfileDto);
  }

  @Transactional()
  async saveMany(
    createProfileDto: CreateProfileDto[],
  ): Promise<ProfileEntity[]> {
    return Promise.all(createProfileDto.map((dto) => this.save(dto)));
  }

  @Transactional()
  async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileEntity | null> {
    return this.profileRepository.update(id, updateProfileDto);
  }

  async softDelete(id: number): Promise<ProfileEntity | null> {
    return this.profileRepository.softDelete(id);
  }

  async delete(id: number): Promise<ProfileEntity | null> {
    const profile = await this.profileRepository.findOneById(id);
    if (!profile) {
      throw new ProfileNotFoundException();
    }
    return this.profileRepository.remove(profile);
  }

  //Extended Methods ===========================================================================

  @Transactional()
  async saveWithUpload(
    createProfileDto: CreateProfileDto,
  ): Promise<ProfileEntity> {
    const { uploads, ...rest } = createProfileDto;
    if (createProfileDto.pictureId)
      await this.uploadService.confirm(createProfileDto.pictureId);
    const profile = await this.profileRepository.save(rest);

    await this.profileUploadService.saveMany(
      uploads.map((upload, index) => ({
        profileId: profile.id,
        uploadId: upload.uploadId,
        order: index,
      })),
    );

    return profile;
  }

  @Transactional()
  async updateWithUpload(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileEntity | null> {
    const { uploads, ...rest } = updateProfileDto;
    const existingProfile = await this.findOneById(id);
    if (!existingProfile) throw new ProfileNotFoundException();

    await this.profileRepository.update(id, rest);
    //clean old profile picture
    if (
      updateProfileDto.pictureId &&
      updateProfileDto.pictureId != existingProfile.pictureId
    ) {
      await this.uploadService.confirm(updateProfileDto.pictureId);
      if (existingProfile.pictureId)
        await this.uploadService.delete(existingProfile.pictureId);
    }

    const updatedProfile = await this.profileRepository.findOne({
      where: { id },
      relations: ['uploads'],
    });

    if (!updatedProfile) throw new ProfileNotFoundException();

    const existingUploads = updatedProfile?.uploads?.map(
      (j: ProfileUploadEntity) => {
        return {
          id: j.id,
          profileId: j.profileId,
          uploadId: j.uploadId,
          order: j.order,
        };
      },
    );

    await this.profileRepository.updateJunctionAssociations<
      Pick<ProfileUploadEntity, 'id' | 'profileId' | 'uploadId' | 'order'>
    >({
      existingItems: existingUploads || [],
      updatedItems:
        uploads?.map((upload, index) => ({
          id: upload.id,
          profileId: id,
          uploadId: upload.uploadId,
          order: index,
        })) || [],
      keys: ['profileId', 'uploadId'],
      onDelete: async (id: number) => this.profileUploadService.softDelete(id),
      onCreate: async (j: CreateProfileUploadDto) =>
        this.profileUploadService.save({
          profileId: id,
          uploadId: j.uploadId,
          order: j.order,
        }),
      onUpdate: async (id: number, item: UpdateProfileUploadDto) =>
        this.profileUploadService.update(id, item),
    });

    return updatedProfile;
  }
}
