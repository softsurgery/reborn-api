import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { LogEntity } from '../entities/log.entity';

@Injectable()
export class LogRepository extends DatabaseAbstractRepository<LogEntity> {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(logRepository, txHost);
  }
}
