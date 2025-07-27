import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { BugEntity } from '../entities/bug.entity';

@Injectable()
export class BugRepository extends DatabaseAbstractRepository<BugEntity> {
  constructor(
    @InjectRepository(BugEntity)
    private readonly bugRepository: Repository<BugEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(bugRepository, txHost);
  }
}
