import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';
import { UploadEntity } from 'src/shared/uploads/entities/upload.entity';

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

  @ManyToOne(() => UploadEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'uploadId' })
  upload?: UploadEntity;

  @Column({ nullable: false })
  order: number;
}
