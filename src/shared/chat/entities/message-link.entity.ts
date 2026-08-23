import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity('message_links')
export class MessageLinkEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  messageId: number;

  @ManyToOne(() => MessageEntity, (message) => message.links, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'messageId' })
  message: MessageEntity;

  @Column({ type: 'text' })
  url: string;

  @Column()
  startOffset: number;

  @Column()
  endOffset: number;

  @Column({ nullable: false })
  order: number;
}
