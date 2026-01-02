import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { EducationRepository } from '../repositories/educations.repository';
import { EducationEntity } from '../entities/education.entity';
import { CreateEducationDto } from '../dtos/education/create-education.dto';
import { UpdateEducationDto } from '../dtos/education/update-education.dto';
import { EducationNotFoundException } from '../errors/education/education.notfound.error';

@Injectable()
export class EducationService {
  constructor(private readonly educationRepository: EducationRepository) {}

  async findOneById(id: string): Promise<EducationEntity> {
    const education = await this.educationRepository.findOneById(id);
    if (!education) {
      throw new EducationNotFoundException();
    }
    return education;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<EducationEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.educationRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const education = await this.educationRepository.findOne(
      queryOptions as FindOneOptions<EducationEntity>,
    );
    return education;
  }

  async findAll(query: IQueryObject): Promise<EducationEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.educationRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const educations = await this.educationRepository.findAll(
      queryOptions as FindManyOptions<EducationEntity>,
    );
    return educations;
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<EducationEntity>> {
    const queryBuilder = new QueryBuilder(
      this.educationRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.educationRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.educationRepository.findAll(
      queryOptions as FindManyOptions<EducationEntity>,
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
  async save(createEducationDto: CreateEducationDto): Promise<EducationEntity> {
    return await this.educationRepository.save(createEducationDto);
  }

  @Transactional()
  async saveMany(
    createEducationDto: CreateEducationDto[],
  ): Promise<EducationEntity[]> {
    return Promise.all(createEducationDto.map((dto) => this.save(dto)));
  }

  @Transactional()
  async update(
    id: string,
    updateEducationDto: UpdateEducationDto,
  ): Promise<EducationEntity | null> {
    return this.educationRepository.update(id, updateEducationDto);
  }

  async softDelete(id: string): Promise<EducationEntity | null> {
    return this.educationRepository.softDelete(id);
  }

  async delete(id: string): Promise<EducationEntity | null> {
    const education = await this.educationRepository.findOneById(id);
    if (!education) {
      throw new EducationNotFoundException();
    }
    return this.educationRepository.remove(education);
  }
}
