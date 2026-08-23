import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { UserBlockEntity } from '../entities/user-block.entity';

@Injectable()
export class UserBlockRepository extends DatabaseAbstractRepository<UserBlockEntity> {
  constructor(
    @InjectRepository(UserBlockEntity)
    private readonly userBlockRepository: Repository<UserBlockEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(userBlockRepository, txHost);
  }
}
