import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { MessageEntity } from './entities/message.entity';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { UserManagementModule } from '../user-management/user-management.module';

@Module({
  controllers: [],
  providers: [ConversationRepository, MessageRepository],
  exports: [ConversationRepository, MessageRepository],
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, MessageEntity]),
    UserManagementModule,
  ],
})
export class ChatModule {}
