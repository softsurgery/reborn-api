import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('educations')
export class EducationEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column()
  institution: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.experiences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: string;
}
