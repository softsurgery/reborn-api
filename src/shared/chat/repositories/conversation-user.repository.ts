import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { ConversationUserEntity } from '../entities/conversation-user.entity';
import { MessageVariant } from '../enums/message-variant.enum';
import { StaticMessageEnum } from 'src/app/enums/static-message.enum';

@Injectable()
export class ConversationUserRepository extends DatabaseAbstractRepository<ConversationUserEntity> {
  constructor(
    @InjectRepository(ConversationUserEntity)
    private readonly conversationUserRepository: Repository<ConversationUserEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(conversationUserRepository, txHost);
  }

  async countUnreadMessages(userId: string): Promise<number> {
    const result = await this.createQueryBuilder('participant')
      .innerJoin('participant.conversation', 'conversation')
      .innerJoin('conversation.messages', 'message')
      .where('participant.userId = :userId', { userId })
      .andWhere('message.userId != :userId')
      .andWhere('message.createdAt > participant.lastCheck')
      .andWhere(
        '(message.variant != :staticVariant OR message.static IS NULL OR message.static != :firstMessage)',
        {
          staticVariant: MessageVariant.STATIC,
          firstMessage: StaticMessageEnum.FIRST_MESSAGE,
        },
      )
      .andWhere(
        `NOT EXISTS (
          SELECT 1 FROM \`user-blocks\` block
          WHERE (
            (block.userId = :userId AND block.blockedUserId = message.userId)
            OR (block.userId = message.userId AND block.blockedUserId = :userId)
          )
        )`,
        { userId },
      )
      .select('COUNT(message.id)', 'count')
      .getRawOne<{ count: string }>();

    return Number(result?.count ?? 0);
  }
}
