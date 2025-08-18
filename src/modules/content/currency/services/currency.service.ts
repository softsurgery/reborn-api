import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { CurrencyEntity } from '../entities/currency.entity';
import { CurrencyNotFoundException } from '../errors/currency.notfound.error';
import { CreateCurrencyDto } from '../dtos/create-currency.dto';
import { UpdateCurrencyDto } from '../dtos/update-currency.dto';
import { CurrencyRepository } from '../repositories/currency.repository';

@Injectable()
export class CurrencyService {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  async findOneById(id: string): Promise<CurrencyEntity> {
    const currency = await this.currencyRepository.findOneById(id);
    if (!currency) {
      throw new CurrencyNotFoundException();
    }
    return currency;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<CurrencyEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.currencyRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const currency = await this.currencyRepository.findOne(
      queryOptions as FindOneOptions<CurrencyEntity>,
    );
    return currency;
  }

  async findAll(query: IQueryObject): Promise<CurrencyEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.currencyRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const currencys = await this.currencyRepository.findAll(
      queryOptions as FindManyOptions<CurrencyEntity>,
    );
    return currencys;
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<CurrencyEntity>> {
    const queryBuilder = new QueryBuilder(
      this.currencyRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.currencyRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.currencyRepository.findAll(
      queryOptions as FindManyOptions<CurrencyEntity>,
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
  async save(createCurrencyDto: CreateCurrencyDto): Promise<CurrencyEntity> {
    return await this.currencyRepository.save(createCurrencyDto);
  }

  @Transactional()
  async saveMany(
    createCurrencyDto: CreateCurrencyDto[],
  ): Promise<CurrencyEntity[]> {
    return Promise.all(createCurrencyDto.map((dto) => this.save(dto)));
  }

  @Transactional()
  async update(
    id: string,
    updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<CurrencyEntity | null> {
    return this.currencyRepository.update(id, updateCurrencyDto);
  }

  async softDelete(id: string): Promise<CurrencyEntity | null> {
    return this.currencyRepository.softDelete(id);
  }

  async delete(id: string): Promise<CurrencyEntity | null> {
    const currency = await this.currencyRepository.findOneById(id);
    if (!currency) {
      throw new CurrencyNotFoundException();
    }
    return this.currencyRepository.remove(currency);
  }
}
