import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { ConversationUserEntity } from '../entities/conversation-user.entity';

@Injectable()
export class ConversationUserRepository extends DatabaseAbstractRepository<ConversationUserEntity> {
  constructor(
    @InjectRepository(ConversationUserEntity)
    private readonly conversationUserRepository: Repository<ConversationUserEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(conversationUserRepository, txHost);
  }
}
