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

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async findOneById(id: string): Promise<ProfileEntity> {
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
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileEntity | null> {
    return this.profileRepository.update(id, updateProfileDto);
  }

  async softDelete(id: string): Promise<ProfileEntity | null> {
    return this.profileRepository.softDelete(id);
  }

  async delete(id: string): Promise<ProfileEntity | null> {
    const profile = await this.profileRepository.findOneById(id);
    if (!profile) {
      throw new ProfileNotFoundException();
    }
    return this.profileRepository.remove(profile);
  }
}
