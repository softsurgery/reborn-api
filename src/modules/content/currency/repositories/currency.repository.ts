import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { CurrencyEntity } from '../entities/currency.entity';

@Injectable()
export class CurrencyRepository extends DatabaseAbstractRepository<CurrencyEntity> {
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(currencyRepository, txHost);
  }
}
