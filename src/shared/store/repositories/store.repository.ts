import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { StoreEntity } from '../entites/store.entity';

@Injectable()
export class StoreRepository extends DatabaseAbstractRepository<StoreEntity> {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(storeRepository, txHost);
  }
}
