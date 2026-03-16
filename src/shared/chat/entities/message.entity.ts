import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { MessageVariant } from '../enums/message-variant.enum';
import { MessageUploadEntity } from './message-storage.entity';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';

@Entity('messages')
export class MessageEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  content: string;

  @ManyToOne(() => AbstractUserEntity)
  @JoinColumn({ name: 'userId' })
  user: AbstractUserEntity;

  @Column({})
  userId: string;

  @ManyToOne(() => ConversationEntity, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversationId' })
  conversation: ConversationEntity;

  @Column({})
  conversationId: number;

  @Column({ type: 'enum', enum: MessageVariant, default: MessageVariant.TEXT })
  variant: MessageVariant;

  @OneToMany(
    () => MessageUploadEntity,
    (messageUpload) => messageUpload.message,
    {
      eager: true,
      nullable: true,
    },
  )
  uploads: MessageUploadEntity[];
}
