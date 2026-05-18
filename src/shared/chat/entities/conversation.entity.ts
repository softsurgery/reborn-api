import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';
import { identifyUser } from 'src/shared/abstract-user-management/utils/identify-user';
import { ConversationUserEntity } from './conversation-user.entity';

@Entity('conversations')
export class ConversationEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(
    () => ConversationUserEntity,
    (participant) => participant.conversation,
    {
      onDelete: 'CASCADE',
    },
  )
  participants: ConversationUserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.conversation)
  messages: MessageEntity[];

  @OneToOne(() => MessageEntity, { nullable: true })
  @JoinColumn({ name: 'lastMessageId' })
  lastMessage: MessageEntity;

  @Column({ nullable: true })
  lastMessageId: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  participantsIdentifiers: string;

  @BeforeInsert()
  @BeforeUpdate()
  syncParticipantsIdentifiers() {
    this.participantsIdentifiers =
      this.participants
        ?.map((p) => identifyUser(p.user))
        .filter(Boolean)
        .join(',') || '';
  }
}
