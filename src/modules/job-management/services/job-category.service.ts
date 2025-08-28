import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { JobCategoryRepository } from '../repositories/job-category.repository';
import { JobCategoryEntity } from '../entities/job-category.entity';
import { JobCategoryNotFoundException } from '../errors/job-category/job-category.notfound.error';
import { CreateJobCategoryDto } from '../dtos/job-category/create-job-category.dto';
import { UpdateJobCategoryDto } from '../dtos/job-category/update-job-category.dto';

@Injectable()
export class JobCategoryService {
  constructor(private readonly jobCategoryRepository: JobCategoryRepository) {}

  async findOneById(id: number): Promise<JobCategoryEntity> {
    const jobCategory = await this.jobCategoryRepository.findOneById(id);
    if (!jobCategory) {
      throw new JobCategoryNotFoundException();
    }
    return jobCategory;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<JobCategoryEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.jobCategoryRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const jobCategory = await this.jobCategoryRepository.findOne(
      queryOptions as FindOneOptions<JobCategoryEntity>,
    );
    return jobCategory;
  }

  async findAll(query: IQueryObject): Promise<JobCategoryEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.jobCategoryRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const jobCategorys = await this.jobCategoryRepository.findAll(
      queryOptions as FindManyOptions<JobCategoryEntity>,
    );
    return jobCategorys;
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<JobCategoryEntity>> {
    const queryBuilder = new QueryBuilder(
      this.jobCategoryRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.jobCategoryRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.jobCategoryRepository.findAll(
      queryOptions as FindManyOptions<JobCategoryEntity>,
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
    createJobCategoryDto: CreateJobCategoryDto,
  ): Promise<JobCategoryEntity> {
    return await this.jobCategoryRepository.save(createJobCategoryDto);
  }

  @Transactional()
  async saveMany(
    createJobCategoryDto: CreateJobCategoryDto[],
  ): Promise<JobCategoryEntity[]> {
    return Promise.all(createJobCategoryDto.map((dto) => this.save(dto)));
  }

  @Transactional()
  async update(
    id: number,
    updateJobCategoryDto: UpdateJobCategoryDto,
  ): Promise<JobCategoryEntity | null> {
    return this.jobCategoryRepository.update(id, updateJobCategoryDto);
  }

  async softDelete(id: number): Promise<JobCategoryEntity | null> {
    return this.jobCategoryRepository.softDelete(id);
  }

  async delete(id: number): Promise<JobCategoryEntity | null> {
    const jobCategory = await this.jobCategoryRepository.findOneById(id);
    if (!jobCategory) {
      throw new JobCategoryNotFoundException();
    }
    return this.jobCategoryRepository.remove(jobCategory);
  }
}
