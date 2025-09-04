import { Transactional } from '@nestjs-cls/transactional';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { JobRequestRepository } from '../repositories/job-request.repository';
import { JobRequestEntity } from '../entities/job-request.entity';
import { JobRequestNotFoundException } from '../errors/job-request/job-request.notfound.error';
import { CreateJobRequestDto } from '../dtos/job-request/create-job-request.dto';
import { UpdateJobRequestDto } from '../dtos/job-request/update-job-request.dto';

@Injectable()
export class JobRequestService {
  constructor(private readonly jobRequestRepository: JobRequestRepository) {}

  async findOneById(id: number): Promise<JobRequestEntity> {
    const jobRequest = await this.jobRequestRepository.findOneById(id);
    if (!jobRequest) {
      throw new JobRequestNotFoundException();
    }
    return jobRequest;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<JobRequestEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.jobRequestRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const jobRequest = await this.jobRequestRepository.findOne(
      queryOptions as FindOneOptions<JobRequestEntity>,
    );
    return jobRequest;
  }

  async findAll(query: IQueryObject): Promise<JobRequestEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.jobRequestRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const jobRequests = await this.jobRequestRepository.findAll(
      queryOptions as FindManyOptions<JobRequestEntity>,
    );
    return jobRequests;
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<JobRequestEntity>> {
    const queryBuilder = new QueryBuilder(
      this.jobRequestRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.jobRequestRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.jobRequestRepository.findAll(
      queryOptions as FindManyOptions<JobRequestEntity>,
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
    createJobRequestDto: CreateJobRequestDto,
    userId?: string,
  ): Promise<JobRequestEntity> {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }
    return await this.jobRequestRepository.save({
      ...createJobRequestDto,
      userId,
    });
  }

  @Transactional()
  async update(
    id: number,
    updateJobRequestDto: UpdateJobRequestDto,
  ): Promise<JobRequestEntity | null> {
    return this.jobRequestRepository.update(id, updateJobRequestDto);
  }

  async softDelete(id: number): Promise<JobRequestEntity | null> {
    return this.jobRequestRepository.softDelete(id);
  }

  async delete(id: number): Promise<JobRequestEntity | null> {
    const jobRequest = await this.jobRequestRepository.findOneById(id);
    if (!jobRequest) {
      throw new JobRequestNotFoundException();
    }
    return this.jobRequestRepository.remove(jobRequest);
  }
}
