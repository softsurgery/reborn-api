import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('templates')
export class TemplateEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: 'text' })
  content?: string;
}
