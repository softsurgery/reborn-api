import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConversationReportReason } from '../enums/conversation-report-reason.enum';
import { ConversationEntity } from './conversation.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Entity('conversation_reports')
export class ConversationReportEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conversationId: number;

  @ManyToOne(() => ConversationEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversationId' })
  conversation: ConversationEntity;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: true })
  reportedUserId?: string;

  @ManyToOne(() => UserEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'reportedUserId' })
  reportedUser?: UserEntity;

  @Column({ type: 'enum', enum: ConversationReportReason })
  reason: ConversationReportReason;

  @Column({ type: 'text' })
  description: string;
}
