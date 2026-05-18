import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { ConversationUserEntity } from './entities/conversation-user.entity';
import { MessageEntity } from './entities/message.entity';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { MessageService } from './services/message.service';
import { ChatGateway } from './gateways/chat.gateway';
import { ConversationService } from './services/conversation.service';
import { UserManagementModule } from 'src/modules/users/user-management.module';
import { ConversationParticipantsTrigger } from './triggers/conversation-participants.trigger';
import { ConversationLastMessageTrigger } from './triggers/conversation-last-message.trigger';
import { DatabaseModule } from '../database/database.module';
import { ConversationUserRepository } from './repositories/conversation-user.repository';
import { ConversationUserService } from './services/conversation-user.service';
import { TriggerRegistry } from '../database/services/trigger-registry.service';

@Module({
  controllers: [],
  providers: [
    ConversationRepository,
    ConversationUserRepository,
    MessageRepository,
    MessageService,
    ConversationService,
    ConversationUserService,
    ChatGateway,
  ],
  exports: [
    ConversationRepository,
    ConversationUserRepository,
    MessageRepository,
    ConversationService,
    ConversationUserService,
    MessageService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      ConversationEntity,
      ConversationUserEntity,
      MessageEntity,
    ]),
    UserManagementModule,
    DatabaseModule,
  ],
})
export class ChatModule {
  constructor(registry: TriggerRegistry) {
    registry.register(new ConversationParticipantsTrigger());
    registry.register(new ConversationLastMessageTrigger());
  }
}
