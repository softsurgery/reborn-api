import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { ExperienceEntity } from '../entities/experience.entity';

import { UpdateExperienceDto } from '../dtos/experience/update-experience.dto';
import { ExperienceNotFoundException } from '../errors/experience/experience.notfound.error';
import { ExperienceRepository } from '../repositories/experience.repository';
import { CreateExperienceDto } from '../dtos/experience/create-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async findOneById(id: string): Promise<ExperienceEntity> {
    const experience = await this.experienceRepository.findOneById(id);
    if (!experience) {
      throw new ExperienceNotFoundException();
    }
    return experience;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<ExperienceEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.experienceRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const experience = await this.experienceRepository.findOne(
      queryOptions as FindOneOptions<ExperienceEntity>,
    );
    return experience;
  }

  async findAll(query: IQueryObject): Promise<ExperienceEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.experienceRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const experiences = await this.experienceRepository.findAll(
      queryOptions as FindManyOptions<ExperienceEntity>,
    );
    return experiences;
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<ExperienceEntity>> {
    const queryBuilder = new QueryBuilder(
      this.experienceRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.experienceRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.experienceRepository.findAll(
      queryOptions as FindManyOptions<ExperienceEntity>,
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
  async save(
    createExperienceDto: CreateExperienceDto,
  ): Promise<ExperienceEntity> {
    return await this.experienceRepository.save(createExperienceDto);
  }

  @Transactional()
  async saveMany(
    createExperienceDto: CreateExperienceDto[],
  ): Promise<ExperienceEntity[]> {
    return Promise.all(createExperienceDto.map((dto) => this.save(dto)));
  }

  @Transactional()
  async update(
    id: string,
    updateExperienceDto: UpdateExperienceDto,
  ): Promise<ExperienceEntity | null> {
    return this.experienceRepository.update(id, updateExperienceDto);
  }

  async softDelete(id: string): Promise<ExperienceEntity | null> {
    return this.experienceRepository.softDelete(id);
  }

  async delete(id: string): Promise<ExperienceEntity | null> {
    const experience = await this.experienceRepository.findOneById(id);
    if (!experience) {
      throw new ExperienceNotFoundException();
    }
    return this.experienceRepository.remove(experience);
  }
}
