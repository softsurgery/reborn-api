import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { FollowEntity } from '../entities/follow.entity';

@Injectable()
export class FollowRepository extends DatabaseAbstractRepository<FollowEntity> {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(followRepository, txHost);
  }
}
