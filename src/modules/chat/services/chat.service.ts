import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageService } from './message.service';
import { ConversationService } from './conversation.service';
import { ConversationNotFoundException } from '../errors/conversation/conversation.notfound.error';
import { MessageEntity } from '../entities/message.entity';
import { UserService } from 'src/modules/users/services/user.service';
import { UserNotFoundException } from 'src/shared/abstract-user-management/errors/user/user.notfound.error';

@Injectable()
export class ChatService {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly conversationService: ConversationService,
  ) {}

  async createMessage(
    createMessage: Partial<MessageEntity>,
    userId?: string,
  ): Promise<MessageEntity> {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }
    if (!createMessage.conversationId) {
      throw new BadRequestException('Conversation id is required');
    }
    const conversation = await this.conversationService.findOneById(
      createMessage.conversationId,
    );

    if (!conversation) {
      throw new ConversationNotFoundException();
    }
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    return this.messageService.save(createMessage, user.id);
  }

  async isUserInConversation(
    conversationId: number,
    userId?: string,
  ): Promise<boolean> {
    const conversation =
      await this.conversationService.findOneById(conversationId);

    if (!conversation) return false;
    return conversation.participants.some((p) => p.id === userId);
  }
}
