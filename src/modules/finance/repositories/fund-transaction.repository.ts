import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { FundTransactionEntity } from '../entities/fund-transaction.entity';

@Injectable()
export class FundTransactionRepository extends DatabaseAbstractRepository<FundTransactionEntity> {
  constructor(
    @InjectRepository(FundTransactionEntity)
    private readonly repository: Repository<FundTransactionEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(repository, txHost);
  }
}
