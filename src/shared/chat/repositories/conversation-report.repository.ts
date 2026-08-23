import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { ConversationReportEntity } from '../entities/conversation-report.entity';

@Injectable()
export class ConversationReportRepository extends DatabaseAbstractRepository<ConversationReportEntity> {
  constructor(
    @InjectRepository(ConversationReportEntity)
    private readonly conversationReportRepository: Repository<ConversationReportEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(conversationReportRepository, txHost);
  }
}
