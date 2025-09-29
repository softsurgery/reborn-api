import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { JobSaveEntity } from '../entities/job-save.entity';
import { JobSaveRepository } from '../repositories/job-save.repository';
import { JobSaveNotFoundException } from '../errors/job-save/job-save.notfound.error';
import { CreateJobSaveDto } from '../dtos/job-save/create-job-save.dto';

@Injectable()
export class JobSaveService {
  constructor(private readonly jobSaveRepository: JobSaveRepository) {}

  async findOneById(id: number): Promise<JobSaveEntity> {
    const jobSave = await this.jobSaveRepository.findOneById(id);
    if (!jobSave) {
      throw new JobSaveNotFoundException();
    }
    return jobSave;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<JobSaveEntity | null> {
    const queryBuilder = new QueryBuilder(this.jobSaveRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const jobSave = await this.jobSaveRepository.findOne(
      queryOptions as FindOneOptions<JobSaveEntity>,
    );
    return jobSave;
  }

  async findAll(query: IQueryObject): Promise<JobSaveEntity[]> {
    const queryBuilder = new QueryBuilder(this.jobSaveRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const jobSaves = await this.jobSaveRepository.findAll(
      queryOptions as FindManyOptions<JobSaveEntity>,
    );
    return jobSaves;
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<JobSaveEntity>> {
    const queryBuilder = new QueryBuilder(this.jobSaveRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.jobSaveRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.jobSaveRepository.findAll(
      queryOptions as FindManyOptions<JobSaveEntity>,
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
    createJobSaveDto: CreateJobSaveDto,
    savedBy?: string,
  ): Promise<JobSaveEntity> {
    return await this.jobSaveRepository.save({
      ...createJobSaveDto,
      userId: savedBy,
    });
  }

  @Transactional()
  async saveMany(
    createJobSaveDto: CreateJobSaveDto[],
  ): Promise<JobSaveEntity[]> {
    return Promise.all(createJobSaveDto.map((dto) => this.save(dto)));
  }

  async softDelete(id: number): Promise<JobSaveEntity | null> {
    return this.jobSaveRepository.softDelete(id);
  }

  async delete(id: number): Promise<JobSaveEntity | null> {
    const jobSave = await this.jobSaveRepository.findOneById(id);
    if (!jobSave) {
      throw new JobSaveNotFoundException();
    }
    return this.jobSaveRepository.remove(jobSave);
  }
}
