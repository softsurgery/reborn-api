import { Transactional } from '@nestjs-cls/transactional';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { JobRepository } from '../repositories/job.repository';
import { JobEntity } from '../entities/job.entity';
import { JobNotFoundException } from '../errors/job/job.notfound.error';
import { CreateJobDto } from '../dtos/job/create-job.dto';
import { UpdateJobDto } from '../dtos/job/update-job.dto';
import { JobTagService } from './job-tag.service';

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly jobTagRepository: JobTagService,
  ) {}

  async findOneById(id: string): Promise<JobEntity> {
    const job = await this.jobRepository.findOneById(id);
    if (!job) {
      throw new JobNotFoundException();
    }
    return job;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<JobEntity | null> {
    const queryBuilder = new QueryBuilder(this.jobRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const job = await this.jobRepository.findOne(
      queryOptions as FindOneOptions<JobEntity>,
    );
    return job;
  }

  async findAll(query: IQueryObject): Promise<JobEntity[]> {
    const queryBuilder = new QueryBuilder(this.jobRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const jobs = await this.jobRepository.findAll(
      queryOptions as FindManyOptions<JobEntity>,
    );
    return jobs;
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<JobEntity>> {
    const queryBuilder = new QueryBuilder(this.jobRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.jobRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.jobRepository.findAll(
      queryOptions as FindManyOptions<JobEntity>,
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
  async save(createJobDto: CreateJobDto): Promise<JobEntity> {
    return await this.jobRepository.save(createJobDto);
  }

  @Transactional()
  async saveMany(createJobDto: CreateJobDto[]): Promise<JobEntity[]> {
    return Promise.all(createJobDto.map((dto) => this.save(dto)));
  }

  @Transactional()
  async update(
    id: string,
    updateJobDto: UpdateJobDto,
  ): Promise<JobEntity | null> {
    const job = await this.jobRepository.findOne({ where: { id } });
    if (!job) return null;

    Object.assign(job, updateJobDto);

    if (updateJobDto.jobTagIds && Array.isArray(updateJobDto.jobTagIds)) {
      const tags = await Promise.all(
        updateJobDto.jobTagIds.map((tagId) =>
          this.jobTagRepository.findOneById(tagId),
        ),
      );
      job.jobTags = tags.filter(Boolean);
    }

    return this.jobRepository.save(job);
  }

  async softDelete(id: string): Promise<JobEntity | null> {
    return this.jobRepository.softDelete(id);
  }

  async delete(id: string): Promise<JobEntity | null> {
    const job = await this.jobRepository.findOneById(id);
    if (!job) {
      throw new JobNotFoundException();
    }
    return this.jobRepository.remove(job);
  }

  //Extended Methods ===========================================================================
  async saveJob(
    createJobDto: CreateJobDto,
    postedBy?: string,
  ): Promise<JobEntity> {
    if (!postedBy) {
      throw new BadRequestException('postedBy is required');
    }
    return this.jobRepository.save({
      ...createJobDto,
      postedById: postedBy,
    });
  }
}
