// storage.interface.ts
import { ReadStream } from 'fs';
import { StorageEntity } from '../entities/storage.entity';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { StorageRepository } from '../repositories/storage.repository';
import { FindManyOptions } from 'typeorm';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { StorageNotFoundException } from '../errors/storage.not-found.error';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';

export abstract class StorageService {
  storageRepository: StorageRepository;
  logger = new Logger(StorageService.name);
  constructor(storageRepository: StorageRepository) {
    this.storageRepository = storageRepository;
  }

  abstract getStorageType(): string;

  async findAllPaginated(query: IQueryObject): Promise<PageDto<StorageEntity>> {
    const queryBuilder = new QueryBuilder(this.storageRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.storageRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.storageRepository.findAll(
      queryOptions as FindManyOptions<StorageEntity>,
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

  async findOneById(id: number): Promise<StorageEntity> {
    const upload = await this.storageRepository.findOneById(id);
    if (!upload) {
      throw new StorageNotFoundException();
    }
    return upload;
  }

  async findBySlug(slug: string): Promise<StorageEntity> {
    const upload = await this.storageRepository.findOne({ where: { slug } });
    if (!upload) {
      throw new StorageNotFoundException();
    }
    return upload;
  }

  // Find single entities
  async findAll(query: IQueryObject = {}): Promise<StorageEntity[]> {
    const queryBuilder = new QueryBuilder(this.storageRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    return await this.storageRepository.findAll(
      queryOptions as FindManyOptions<StorageEntity>,
    );
  }

  // Store files
  abstract store(
    file: Express.Multer.File,
    isTemporary?: boolean,
    isPrivate?: boolean,
  ): Promise<StorageEntity>;
  abstract storeMultipleFiles(
    files: Express.Multer.File[],
    isTemporary?: boolean,
    isPrivate?: boolean,
  ): Promise<StorageEntity[]>;

  async expose(id: number): Promise<StorageEntity> {
    const upload = await this.findOneById(id);
    upload.isPrivate = false;
    return await this.storageRepository.save(upload);
  }

  async hide(id: number): Promise<StorageEntity> {
    const upload = await this.findOneById(id);
    upload.isPrivate = true;
    return await this.storageRepository.save(upload);
  }

  async confirm(id: number): Promise<StorageEntity> {
    const upload = await this.findOneById(id);
    upload.isTemporary = false;
    return await this.storageRepository.save(upload);
  }

  async unconfirm(id: number): Promise<StorageEntity> {
    const upload = await this.findOneById(id);
    upload.isTemporary = true;
    return await this.storageRepository.save(upload);
  }

  async findTemporary(): Promise<StorageEntity[]> {
    const uploads = await this.storageRepository.findAll({
      where: { isTemporary: true },
    });
    return uploads;
  }

  // Load file from storage
  abstract loadResource(slug: string): Promise<ReadStream>;

  // Duplicate
  abstract duplicate(id: number): Promise<StorageEntity>;
  abstract duplicateMany(ids: number[]): Promise<StorageEntity[]>;

  // Delete
  abstract delete(id: number): Promise<StorageEntity>;
  abstract deleteBySlug(slug: string): Promise<StorageEntity>;
  abstract deleteMany(ids: number[]): Promise<void>;

  async getTotal(): Promise<number> {
    return this.storageRepository.getTotalCount();
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async cleanTemporary(): Promise<void> {
    this.logger.log('Cleaning temporary uploads');
    const uploads = await this.findTemporary();
    await Promise.all(uploads.map((upload) => this.delete(upload.id)));
    if (uploads.length === 0) this.logger.log('No temporary uploads to clean');
    else this.logger.log(`Cleaned ${uploads.length} temporary uploads`);
  }
}
