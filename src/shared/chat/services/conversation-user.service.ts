import { Injectable } from '@nestjs/common';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { ConversationUserEntity } from '../entities/conversation-user.entity';
import { ConversationUserRepository } from '../repositories/conversation-user.repository';

@Injectable()
export class ConversationUserService extends AbstractCrudService<ConversationUserEntity> {
  constructor(
    private readonly conversationUserRepository: ConversationUserRepository,
  ) {
    super(conversationUserRepository);
  }

  async findByUserId(userId?: string): Promise<ConversationUserEntity[]> {
    return this.conversationUserRepository.findAll({
      where: { userId },
    });
  }

  async findByConversationAndUser(
    conversationId: number,
    userId: string,
  ): Promise<ConversationUserEntity | null> {
    return this.conversationUserRepository.findOne({
      where: { conversationId, userId },
    });
  }

  async removeByConversationAndUser(
    conversationId: number,
    userId: string,
  ): Promise<ConversationUserEntity | null> {
    const participant = await this.findByConversationAndUser(
      conversationId,
      userId,
    );
    if (!participant) return null;
    return this.conversationUserRepository.delete(participant.id);
  }

  async removeSharedConversations(
    userId: string,
    otherUserId: string,
  ): Promise<void> {
    const userConversations = await this.findByUserId(userId);
    const otherConversations = await this.findByUserId(otherUserId);

    const otherConversationIds = new Set(
      otherConversations.map((entry) => entry.conversationId),
    );

    const sharedConversationIds = userConversations
      .filter((entry) => otherConversationIds.has(entry.conversationId))
      .map((entry) => entry.conversationId);

    await Promise.all(
      sharedConversationIds.map((conversationId) =>
        this.removeByConversationAndUser(conversationId, userId),
      ),
    );
  }

  async countUnreadConversations(userId: string): Promise<number> {
    return this.conversationUserRepository.countUnreadMessages(userId);
  }
}
