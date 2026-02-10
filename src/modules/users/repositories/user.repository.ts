import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends DatabaseAbstractRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(userRepository, txHost);
  }
}
