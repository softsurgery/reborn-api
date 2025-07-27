import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { LogRepository } from '../repositories/log.repository';
import { LogEntity } from '../entities/log.entity';
import { LogNotFoundException } from '../errors/log.notfound.error';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';

@Injectable()
export class LoggerService {
  constructor(private readonly loggerRepository: LogRepository) {}

  async findOneById(id: number): Promise<LogEntity> {
    const log = await this.loggerRepository.findOneById(id);
    if (!log) {
      throw new LogNotFoundException();
    }
    return log;
  }

  async findAll(query: IQueryObject): Promise<LogEntity[]> {
    const queryBuilder = new QueryBuilder(this.loggerRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    return await this.loggerRepository.findAll(
      queryOptions as FindManyOptions<LogEntity>,
    );
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<LogEntity>> {
    const queryBuilder = new QueryBuilder(this.loggerRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.loggerRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.loggerRepository.findAll(
      queryOptions as FindManyOptions<LogEntity>,
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

  async save(log: Partial<LogEntity>): Promise<LogEntity> {
    const entity = await this.loggerRepository.save(log);
    return entity;
  }

  async softDelete(id: number): Promise<LogEntity | null> {
    return this.loggerRepository.softDelete(id);
  }

  async deleteAll() {
    return this.loggerRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.loggerRepository.getTotalCount();
  }
}
