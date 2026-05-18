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
}
