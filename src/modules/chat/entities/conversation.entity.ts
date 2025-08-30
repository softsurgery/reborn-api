import { UserEntity } from 'src/modules/user-management/entities/user.entity';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity('conversations')
export class ConversationEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => UserEntity, {
    eager: true,
  })
  @JoinTable()
  participants: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.conversation)
  messages: MessageEntity[];
}
