import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { JobTagRepository } from '../repositories/job-tag.repository';
import { JobTagEntity } from '../entities/job-tag.entity';
import { JobTagNotFoundException } from '../errors/job-tag/job-tag.notfound.error';
import { CreateJobTagDto } from '../dtos/job-tag/create-job-tag.dto';
import { UpdateJobTagDto } from '../dtos/job-tag/update-job-tag.dto';

@Injectable()
export class JobTagService {
  constructor(private readonly jobTagRepository: JobTagRepository) {}

  async findOneById(id: string): Promise<JobTagEntity> {
    const jobTag = await this.jobTagRepository.findOneById(id);
    if (!jobTag) {
      throw new JobTagNotFoundException();
    }
    return jobTag;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<JobTagEntity | null> {
    const queryBuilder = new QueryBuilder(this.jobTagRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const jobTag = await this.jobTagRepository.findOne(
      queryOptions as FindOneOptions<JobTagEntity>,
    );
    return jobTag;
  }

  async findAll(query: IQueryObject): Promise<JobTagEntity[]> {
    const queryBuilder = new QueryBuilder(this.jobTagRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const jobTags = await this.jobTagRepository.findAll(
      queryOptions as FindManyOptions<JobTagEntity>,
    );
    return jobTags;
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<JobTagEntity>> {
    const queryBuilder = new QueryBuilder(this.jobTagRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.jobTagRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.jobTagRepository.findAll(
      queryOptions as FindManyOptions<JobTagEntity>,
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
  async save(createJobTagDto: CreateJobTagDto): Promise<JobTagEntity> {
    return await this.jobTagRepository.save(createJobTagDto);
  }

  @Transactional()
  async saveMany(createJobTagDto: CreateJobTagDto[]): Promise<JobTagEntity[]> {
    return Promise.all(createJobTagDto.map((dto) => this.save(dto)));
  }

  @Transactional()
  async update(
    id: string,
    updateJobTagDto: UpdateJobTagDto,
  ): Promise<JobTagEntity | null> {
    return this.jobTagRepository.update(id, updateJobTagDto);
  }

  async softDelete(id: string): Promise<JobTagEntity | null> {
    return this.jobTagRepository.softDelete(id);
  }

  async delete(id: string): Promise<JobTagEntity | null> {
    const jobTag = await this.jobTagRepository.findOneById(id);
    if (!jobTag) {
      throw new JobTagNotFoundException();
    }
    return this.jobTagRepository.remove(jobTag);
  }
}
