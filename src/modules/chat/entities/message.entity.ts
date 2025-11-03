import { UserEntity } from 'src/modules/user-management/entities/user.entity';
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
import { MessageUploadEntity } from './message-upload.entity';

@Entity('messages')
export class MessageEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  content: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

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
