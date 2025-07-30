import { Injectable } from '@nestjs/common';
import { StoreRepository } from '../repositories/store.repository';
import { StoreEntity } from '../entites/store.entity';
import { StoreNotFoundException } from '../errors/store.notfound.error';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async findOneById(id: string): Promise<StoreEntity> {
    const store = await this.storeRepository.findOneById(id);
    if (!store) {
      throw new StoreNotFoundException();
    }
    return store;
  }

  async findOneByCondition(query: IQueryObject): Promise<StoreEntity | null> {
    const queryBuilder = new QueryBuilder(this.storeRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const store = await this.storeRepository.findOne(
      queryOptions as FindOneOptions<StoreEntity>,
    );
    if (!store) return null;
    return store;
  }

  async findAll(query: IQueryObject = {}): Promise<StoreEntity[]> {
    const queryBuilder = new QueryBuilder(this.storeRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    return await this.storeRepository.findAll(
      queryOptions as FindManyOptions<StoreEntity>,
    );
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<StoreEntity>> {
    const queryBuilder = new QueryBuilder(this.storeRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.storeRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.storeRepository.findAll(
      queryOptions as FindManyOptions<StoreEntity>,
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
  async save(createStoreDto: Partial<StoreEntity>) {
    return this.storeRepository.save(createStoreDto);
  }

  async saveMany(createStoreDtos: Partial<StoreEntity>[]) {
    return this.storeRepository.saveMany(createStoreDtos);
  }

  async update(
    id: string,
    updateStoreDto: Partial<StoreEntity>,
  ): Promise<StoreEntity | null> {
    const store = await this.findOneById(id);
    if (!store) return null;
    Object.assign(store, updateStoreDto);
    return this.storeRepository.save(store);
  }

  async softDelete(id: string): Promise<StoreEntity | null> {
    return this.storeRepository.softDelete(id);
  }

  async delete(id: string): Promise<StoreEntity | null> {
    const store = await this.findOneById(id);
    return this.storeRepository.remove(store);
  }
}
