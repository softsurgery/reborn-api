import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { PointTransactionEntity } from '../entities/point-transaction.entity';

@Injectable()
export class PointTransactionRepository extends DatabaseAbstractRepository<PointTransactionEntity> {
  constructor(
    @InjectRepository(PointTransactionEntity)
    private readonly repository: Repository<PointTransactionEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(repository, txHost);
  }
}
