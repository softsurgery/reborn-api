import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { StorageEntity } from '../entities/storage.entity';

@Injectable()
export class StorageRepository extends DatabaseAbstractRepository<StorageEntity> {
  constructor(
    @InjectRepository(StorageEntity)
    private readonly storageRepository: Repository<StorageEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(storageRepository, txHost);
  }
}
