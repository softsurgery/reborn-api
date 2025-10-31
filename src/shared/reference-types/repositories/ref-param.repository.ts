import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { RefParamEntity } from '../entities/ref-param.entity';

@Injectable()
export class RefParamRepository extends DatabaseAbstractRepository<RefParamEntity> {
  constructor(
    @InjectRepository(RefParamEntity)
    private readonly refParamRepository: Repository<RefParamEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(refParamRepository, txHost);
  }
}
