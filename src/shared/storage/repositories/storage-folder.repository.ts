import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { StorageFolderEntity } from '../entities/storage-folder.entity';

@Injectable()
export class StorageFolderRepository extends DatabaseAbstractRepository<StorageFolderEntity> {
  constructor(
    @InjectRepository(StorageFolderEntity)
    private readonly storageFolderRepository: Repository<StorageFolderEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(storageFolderRepository, txHost);
  }
}
