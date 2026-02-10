import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
} from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { DatabaseAbstractRepository } from '../repositories/database.repository';

@Injectable()
export class AbstractCrudService<T extends ObjectLiteral> {
  repository: DatabaseAbstractRepository<T>;
  constructor(repository: DatabaseAbstractRepository<T>) {
    this.repository = repository;
  }

  async findOneById(id: number | string): Promise<T | null> {
    const entity = await this.repository.findOneById(id);
    if (!entity) {
      throw new Error(
        `${this.repository.getMetadata().name} with id ${id} is not found`,
      );
    }
    return entity;
  }

  async findOneByCondition(query: IQueryObject): Promise<T | null> {
    const queryBuilder = new QueryBuilder(this.repository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const entity = await this.repository.findOne(
      queryOptions as FindOneOptions<T>,
    );
    if (!entity) return null;
    return entity;
  }

  async findAll(query: IQueryObject = {}): Promise<T[]> {
    const queryBuilder = new QueryBuilder(this.repository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    return await this.repository.findAll(queryOptions as FindManyOptions<T>);
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<T>> {
    const queryBuilder = new QueryBuilder(this.repository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.repository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.repository.findAll(
      queryOptions as FindManyOptions<T>,
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
  async save(dto: DeepPartial<T>) {
    return this.repository.save(dto);
  }

  @Transactional()
  async saveMany(dtos: DeepPartial<T>[]) {
    return this.repository.saveMany(dtos);
  }

  @Transactional()
  async update(id: string | number, dto: Partial<T>) {
    const entity = await this.findOneById(id);
    if (!entity) throw new Error('Entity not found');
    return this.repository.update(id, dto);
  }

  @Transactional()
  async updateMany(dtos: DeepPartial<T>[]) {
    return this.repository.saveMany(dtos);
  }

  async softDelete(id: string): Promise<T | null> {
    return this.repository.softDelete(id);
  }

  async delete(id: string): Promise<T | null> {
    const entity = await this.findOneById(id);
    if (!entity) throw new Error('Entity not found');
    return this.repository.remove(entity);
  }
}
