import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { RefTypeRepository } from '../repositories/ref-type.repository';
import { RefTypeEntity } from '../entities/ref-type.entity';
import { RefTypeNotFoundException } from '../errors/ref-type/ref-type.notfound.error';

@Injectable()
export class RefTypeService {
  constructor(private readonly refTypeRepository: RefTypeRepository) {}

  async findOneById(id: string): Promise<RefTypeEntity> {
    const type = await this.refTypeRepository.findOneById(id);
    if (!type) {
      throw new RefTypeNotFoundException();
    }
    return type;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<RefTypeEntity | null> {
    const queryBuilder = new QueryBuilder(this.refTypeRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const type = await this.refTypeRepository.findOne(
      queryOptions as FindOneOptions<RefTypeEntity>,
    );
    return type;
  }

  async findAll(query: IQueryObject): Promise<RefTypeEntity[]> {
    const queryBuilder = new QueryBuilder(this.refTypeRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const types = await this.refTypeRepository.findAll(
      queryOptions as FindManyOptions<RefTypeEntity>,
    );
    return types;
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<RefTypeEntity>> {
    const queryBuilder = new QueryBuilder(this.refTypeRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.refTypeRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.refTypeRepository.findAll(
      queryOptions as FindManyOptions<RefTypeEntity>,
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
  async save(refType: Partial<RefTypeEntity>): Promise<RefTypeEntity> {
    return await this.refTypeRepository.save(refType);
  }

  @Transactional()
  async saveMany(refTypes: Partial<RefTypeEntity>[]): Promise<RefTypeEntity[]> {
    return Promise.all(refTypes.map((dto) => this.save(dto)));
  }

  @Transactional()
  async update(
    id: string,
    refType: Partial<RefTypeEntity>,
  ): Promise<RefTypeEntity | null> {
    return this.refTypeRepository.update(id, refType);
  }

  async softDelete(id: string): Promise<RefTypeEntity | null> {
    return this.refTypeRepository.softDelete(id);
  }

  async delete(id: string): Promise<RefTypeEntity | null> {
    const type = await this.refTypeRepository.findOneById(id);
    if (!type) {
      throw new RefTypeNotFoundException();
    }
    return this.refTypeRepository.remove(type);
  }
}
