import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MigrationEntity } from '../entities/migration.entity';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from './database.repository';

@Injectable()
export class MigrationRepository extends DatabaseAbstractRepository<MigrationEntity> {
  constructor(
    @InjectRepository(MigrationEntity)
    private readonly migrationRepository: Repository<MigrationEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(migrationRepository, txHost);
  }
}
