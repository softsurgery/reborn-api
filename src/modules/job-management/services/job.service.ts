import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
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
import { JobUploadService } from './job-upload.service';
import { JobUploadEntity } from '../entities/job-upload.entity';
import { CreateJobUploadDto } from '../dtos/job-upload/create-job-upload.dto';
import { UpdateJobUploadDto } from '../dtos/job-upload/update-job-upload.dto';
import { JobTagEntity } from '../entities/job-tag.entity';

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly jobTagService: JobTagService,
    private readonly jobUploadService: JobUploadService,
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

    if (updateJobDto.tagIds && Array.isArray(updateJobDto.tagIds)) {
      const tags = await Promise.all(
        updateJobDto.tagIds.map((tagId) =>
          this.jobTagService.findOneById(tagId),
        ),
      );
      job.tags = tags.filter(Boolean);
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
  @Transactional()
  async saveJob(
    createJobDto: CreateJobDto,
    postedBy?: string,
  ): Promise<JobEntity> {
    const { uploads, tagIds, ...rest } = createJobDto;
    let tags: JobTagEntity[] = [];

    if (tagIds && Array.isArray(tagIds)) {
      tags = await Promise.all(
        tagIds.map((tagId) => this.jobTagService.findOneById(tagId)),
      );
    }

    const job = await this.jobRepository.save({
      ...rest,
      tags,
      postedById: postedBy,
    });

    await this.jobUploadService.saveMany(
      uploads.map((upload, index) => ({
        jobId: job.id,
        uploadId: upload.uploadId,
        order: index,
      })),
    );

    return job;
  }

  @Transactional()
  async updateJob(
    id: string,
    updateJobDto: UpdateJobDto,
  ): Promise<JobEntity | null> {
    const { uploads, tagIds, ...rest } = updateJobDto;
    let tags: JobTagEntity[] = [];

    if (tagIds && Array.isArray(tagIds)) {
      tags = await Promise.all(
        tagIds.map((tagId) => this.jobTagService.findOneById(tagId)),
      );
    }
    const existingJob = await this.jobRepository.findOneById(id);
    if (!existingJob) throw new JobNotFoundException();

    existingJob.tags = tags;
    Object.assign(existingJob, rest);

    await this.jobRepository.save(existingJob);

    const updatedJob = await this.jobRepository.findOne({
      where: { id },
      relations: ['tags', 'uploads'],
    });

    if (!updatedJob) throw new JobNotFoundException();

    const existingUploads = updatedJob?.uploads?.map((j: JobUploadEntity) => {
      return {
        id: j.id,
        jobId: j.jobId,
        uploadId: j.uploadId,
        order: j.order,
      };
    });

    await this.jobRepository.updateJunctionAssociations<
      Pick<JobUploadEntity, 'id' | 'jobId' | 'uploadId' | 'order'>
    >({
      existingItems: existingUploads || [],
      updatedItems:
        uploads?.map((upload, index) => ({
          id: upload.id,
          jobId: id,
          uploadId: upload.uploadId,
          order: index,
        })) || [],
      keys: ['jobId', 'uploadId'],
      onDelete: async (id: number) => this.jobUploadService.softDelete(id),
      onCreate: async (j: CreateJobUploadDto) =>
        this.jobUploadService.save({
          jobId: id,
          uploadId: j.uploadId,
          order: j.order,
        }),
      onUpdate: async (id: number, item: UpdateJobUploadDto) =>
        this.jobUploadService.update(id, item),
    });

    return updatedJob;
  }
}
