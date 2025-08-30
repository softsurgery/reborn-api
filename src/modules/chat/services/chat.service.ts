import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageService } from './message.service';
import { UserService } from 'src/modules/user-management/services/user.service';
import { ConversationService } from './conversation.service';
import { ConversationNotFoundException } from '../errors/conversation/conversation.notfound.error';
import { UserNotFoundException } from 'src/modules/user-management/errors/user/user.notfound.error';
import { MessageEntity } from '../entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly conversationService: ConversationService,
  ) {}

  async createMessage(
    conversationId: number,
    content: string,
    userId?: string,
  ): Promise<MessageEntity> {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }
    const conversation =
      await this.conversationService.findOneById(conversationId);

    if (!conversation) {
      throw new ConversationNotFoundException();
    }
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    return this.messageService.save(
      {
        content,
        conversationId,
      },
      user.id,
    );
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
