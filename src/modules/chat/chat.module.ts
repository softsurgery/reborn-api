import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { MessageEntity } from './entities/message.entity';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { MessageService } from './services/message.service';
import { ChatGateway } from './controllers/chat.gateway';
import { ConversationService } from './services/conversation.service';
import { ChatService } from './services/chat.service';
import { UserManagementModule } from '../users/user-management.module';

@Module({
  controllers: [],
  providers: [
    ConversationRepository,
    MessageRepository,
    MessageService,
    ConversationService,
    ChatService,
    ChatGateway,
  ],
  exports: [
    ConversationRepository,
    MessageRepository,
    ConversationService,
    MessageService,
    ChatService,
  ],
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, MessageEntity]),
    UserManagementModule,
  ],
})
export class ChatModule {}
