import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';
import { StorageEntity } from 'src/shared/storage/entities/storage.entity';

@Entity('message_uploads')
export class MessageUploadEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  messageId: string;

  @Column()
  uploadId: number;

  @ManyToOne(() => MessageEntity, (message) => message.uploads, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'messageId' })
  message: MessageEntity;

  @ManyToOne(() => StorageEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'uploadId' })
  upload?: StorageEntity;

  @Column({ nullable: false })
  order: number;
}
