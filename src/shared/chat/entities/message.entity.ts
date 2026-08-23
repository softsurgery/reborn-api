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
import { MessageLinkEntity } from './message-link.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { StaticMessageEnum } from 'src/app/enums/static-message.enum';

@Entity('messages')
export class MessageEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => ConversationEntity, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversationId' })
  conversation: ConversationEntity;

  @Column({ nullable: false })
  conversationId: number;

  @Column({ type: 'enum', enum: MessageVariant, default: MessageVariant.TEXT })
  variant: MessageVariant;

  @Column({
    type: 'enum',
    enum: StaticMessageEnum,
    default: null,
  })
  static?: StaticMessageEnum;

  @OneToMany(() => MessageUploadEntity, (upload) => upload.message, {
    nullable: true,
  })
  uploads: MessageUploadEntity[];

  @OneToMany(() => MessageLinkEntity, (link) => link.message, {
    nullable: true,
  })
  links: MessageLinkEntity[];
}
