import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { JobSaveNotFoundException } from '../errors/job-save/job-save.notfound.error';
import { JobViewRepository } from '../repositories/job-view.repository';
import { JobViewEntity } from '../entities/job-view.entity';
import { JobViewNotFoundException } from '../errors/job-view/job-view.notfound.error';
import { CreateJobViewDto } from '../dtos/job-view/create-job-view.dto';

@Injectable()
export class JobViewService {
  constructor(private readonly jobViewRepository: JobViewRepository) {}

  async findOneById(id: number): Promise<JobViewEntity> {
    const jobView = await this.jobViewRepository.findOneById(id);
    if (!jobView) {
      throw new JobViewNotFoundException();
    }
    return jobView;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<JobViewEntity | null> {
    const queryBuilder = new QueryBuilder(this.jobViewRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const jobView = await this.jobViewRepository.findOne(
      queryOptions as FindOneOptions<JobViewEntity>,
    );
    return jobView;
  }

  async findAll(query: IQueryObject): Promise<JobViewEntity[]> {
    const queryBuilder = new QueryBuilder(this.jobViewRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const jobViews = await this.jobViewRepository.findAll(
      queryOptions as FindManyOptions<JobViewEntity>,
    );
    return jobViews;
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<JobViewEntity>> {
    const queryBuilder = new QueryBuilder(this.jobViewRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.jobViewRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.jobViewRepository.findAll(
      queryOptions as FindManyOptions<JobViewEntity>,
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
    createJobViewDto: CreateJobViewDto,
    savedBy?: string,
  ): Promise<JobViewEntity> {
    return await this.jobViewRepository.save({
      ...createJobViewDto,
      userId: savedBy,
    });
  }

  @Transactional()
  async saveMany(
    createJobViewDto: CreateJobViewDto[],
  ): Promise<JobViewEntity[]> {
    return Promise.all(createJobViewDto.map((dto) => this.save(dto)));
  }

  async softDelete(id: number): Promise<JobViewEntity | null> {
    return this.jobViewRepository.softDelete(id);
  }

  async delete(id: number): Promise<JobViewEntity | null> {
    const jobView = await this.jobViewRepository.findOneById(id);
    if (!jobView) {
      throw new JobSaveNotFoundException();
    }
    return this.jobViewRepository.remove(jobView);
  }
}
