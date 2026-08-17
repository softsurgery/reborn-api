import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import {
  QueryBuilder,
  mergeWhereConditions,
} from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { JobSaveEntity } from '../entities/job-save.entity';
import { JobSaveRepository } from '../repositories/job-save.repository';
import { JobSaveNotFoundException } from '../errors/job-save/job-save.notfound.error';
import { CreateJobSaveDto } from '../dtos/job-save/create-job-save.dto';
import { UserNotFoundException } from 'src/shared/abstract-user-management/errors/user/user.notfound.error';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export class JobSaveService extends AbstractCrudService<JobSaveEntity> {
  constructor(private readonly jobSaveRepository: JobSaveRepository) {
    super(jobSaveRepository);
  }

  async findAllUserPaginated(
    query: IQueryObject,
    userId?: string,
  ): Promise<PageDto<JobSaveEntity>> {
    if (!userId) {
      throw new UserNotFoundException();
    }

    const searchFields = this.jobSaveRepository.getSearchFields();
    const queryBuilder = new QueryBuilder(
      this.jobSaveRepository.getMetadata(),
      {},
      searchFields.length ? searchFields : undefined,
    );

    const queryOptions = queryBuilder.build(query);

    queryOptions.where = mergeWhereConditions(queryOptions.where, { userId });

    const count = await this.jobSaveRepository.getTotalCount({
      where: queryOptions.where,
      relations: queryOptions.relations,
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

  async isJobSaveAlreadyExists(
    jobId: string,
    userId?: string,
  ): Promise<JobSaveEntity | null> {
    if (!userId) {
      throw new UserNotFoundException();
    }

    return this.jobSaveRepository.findByUserAndJob(userId, jobId);
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
  async unsave(
    jobId: string,
    unsavedBy?: string,
  ): Promise<JobSaveEntity | null> {
    const jobSave = await this.jobSaveRepository.findOne({
      where: {
        jobId,
        userId: unsavedBy,
      },
    });
    if (!jobSave) {
      throw new JobSaveNotFoundException();
    }
    return this.jobSaveRepository.softDelete(jobSave.id);
  }
}
