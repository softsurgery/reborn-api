import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TemplateEntity } from './template.entity';

@Entity('template-styles')
export class TemplateStyleEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'longtext', nullable: true })
  content?: string;

  @ManyToMany(() => TemplateEntity, (template) => template.styles)
  templates: TemplateEntity[];
}
