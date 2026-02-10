import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { SessionEntity } from '../entities/session.entity';

@Injectable()
export class SessionRepository extends DatabaseAbstractRepository<SessionEntity> {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(sessionRepository, txHost);
  }
}
