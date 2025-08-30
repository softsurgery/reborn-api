import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { ConversationEntity } from '../entities/conversation.entity';

@Injectable()
export class ConversationRepository extends DatabaseAbstractRepository<ConversationEntity> {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(conversationRepository, txHost);
  }
}
