import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { JobUploadRepository } from '../repositories/job-upload.repository';
import { JobUploadEntity } from '../entities/job-upload.entity';
import { JobUploadNotFoundException } from '../errors/job-upload/job-upload.notfound.error';
import { CreateJobUploadDto } from '../dtos/job-upload/create-job-upload.dto';
import { UpdateJobUploadDto } from '../dtos/job-upload/update-job-upload.dto';
import { StorageService } from 'src/shared/storage/services/storage.service';

@Injectable()
export class JobUploadService {
  constructor(
    private readonly jobUploadRepository: JobUploadRepository,
    private readonly storageService: StorageService,
  ) {}

  async findOneById(id: number): Promise<JobUploadEntity> {
    const jobUpload = await this.jobUploadRepository.findOneById(id);
    if (!jobUpload) {
      throw new JobUploadNotFoundException();
    }
    return jobUpload;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<JobUploadEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.jobUploadRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const jobUpload = await this.jobUploadRepository.findOne(
      queryOptions as FindOneOptions<JobUploadEntity>,
    );
    if (!jobUpload) return null;
    return jobUpload;
  }

  async findAll(query: IQueryObject): Promise<JobUploadEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.jobUploadRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    return await this.jobUploadRepository.findAll(
      queryOptions as FindManyOptions<JobUploadEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<JobUploadEntity>> {
    const queryBuilder = new QueryBuilder(
      this.jobUploadRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.jobUploadRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.jobUploadRepository.findAll(
      queryOptions as FindManyOptions<JobUploadEntity>,
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
  async save(createJobUploadDto: CreateJobUploadDto) {
    if (createJobUploadDto.uploadId)
      await this.storageService.confirm(createJobUploadDto.uploadId);
    return this.jobUploadRepository.save(createJobUploadDto);
  }

  @Transactional()
  async saveMany(createJobUploadDto: CreateJobUploadDto[]) {
    await Promise.all(
      createJobUploadDto.map(async (dto) => {
        if (dto.uploadId) await this.storageService.confirm(dto.uploadId);
      }),
    );
    return this.jobUploadRepository.saveMany(createJobUploadDto);
  }

  async update(
    id: number,
    updateJobUploadDto: UpdateJobUploadDto,
  ): Promise<JobUploadEntity | null> {
    return this.jobUploadRepository.update(id, updateJobUploadDto);
  }

  async softDelete(id: number): Promise<JobUploadEntity | null> {
    return this.jobUploadRepository.softDelete(id);
  }

  async delete(id: number): Promise<JobUploadEntity | null> {
    const jobUpload = await this.findOneById(id);
    return this.jobUploadRepository.remove(jobUpload);
  }
}
