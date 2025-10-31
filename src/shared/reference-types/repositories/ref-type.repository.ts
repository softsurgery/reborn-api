import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { RefTypeEntity } from '../entities/ref-type.entity';

@Injectable()
export class RefTypeRepository extends DatabaseAbstractRepository<RefTypeEntity> {
  constructor(
    @InjectRepository(RefTypeEntity)
    private readonly refTypeRepository: Repository<RefTypeEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(refTypeRepository, txHost);
  }
}
