import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { ConversationUserEntity } from './entities/conversation-user.entity';
import { MessageEntity } from './entities/message.entity';
import { MessageUploadEntity } from './entities/message-upload.entity';
import { MessageLinkEntity } from './entities/message-link.entity';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { MessageService } from './services/message.service';
import { ChatGateway } from './gateways/chat.gateway';
import { ConversationService } from './services/conversation.service';
import { UserManagementModule } from 'src/modules/users/user-management.module';
import { TriggerRegistry } from '../database/services/trigger-registry.service';
import { ConversationParticipantsTrigger } from './triggers/conversation-participants.trigger';
import { ConversationLastMessageTrigger } from './triggers/conversation-last-message.trigger';
import { DatabaseModule } from '../database/database.module';
import { ConversationUserRepository } from './repositories/conversation-user.repository';
import { ConversationUserService } from './services/conversation-user.service';
import { MessageUploadRepository } from './repositories/message-upload.repository';
import { MessageLinkRepository } from './repositories/message-link.repository';
import { MessageUploadService } from './services/message-upload.service';
import { MessageLinkService } from './services/message-link.service';
import { StorageModule } from '../storage/storage.module';
import { ConversationReportEntity } from './entities/conversation-report.entity';
import { ConversationReportRepository } from './repositories/conversation-report.repository';
import { ConversationReportService } from './services/conversation-report.service';

@Module({
  controllers: [],
  providers: [
    ConversationRepository,
    ConversationUserRepository,
    MessageRepository,
    MessageUploadRepository,
    MessageLinkRepository,
    MessageService,
    MessageUploadService,
    MessageLinkService,
    ConversationService,
    ConversationUserService,
    ConversationReportRepository,
    ConversationReportService,
    ChatGateway,
  ],
  exports: [
    ConversationRepository,
    ConversationUserRepository,
    MessageRepository,
    ConversationService,
    ConversationUserService,
    ConversationReportRepository,
    ConversationReportService,
    MessageService,
    ChatGateway,
  ],
  imports: [
    TypeOrmModule.forFeature([
      ConversationEntity,
      ConversationUserEntity,
      MessageEntity,
      MessageUploadEntity,
      MessageLinkEntity,
      ConversationReportEntity,
    ]),
    UserManagementModule,
    DatabaseModule,
    StorageModule,
  ],
})
export class ChatModule {
  constructor(registry: TriggerRegistry) {
    registry.register(new ConversationParticipantsTrigger());
    registry.register(new ConversationLastMessageTrigger());
  }
}
