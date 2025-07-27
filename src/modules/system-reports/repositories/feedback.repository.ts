import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { FeedbackEntity } from '../entities/feedback.entity';

@Injectable()
export class FeedbackRepository extends DatabaseAbstractRepository<FeedbackEntity> {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(feedbackRepository, txHost);
  }
}
