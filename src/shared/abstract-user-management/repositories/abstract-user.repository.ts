import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { AbstractUserEntity } from '../entities/abstract-user.entity';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';

@Injectable()
export class AbstractUserRepository extends DatabaseAbstractRepository<AbstractUserEntity> {
  constructor(
    @InjectRepository(AbstractUserEntity)
    private readonly userRepository: Repository<AbstractUserEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(userRepository, txHost);
  }
}
