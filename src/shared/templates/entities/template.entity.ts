import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TemplateStyleEntity } from './template-style.entity';

@Entity('templates')
export class TemplateEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: 'longtext' })
  content?: string;

  @ManyToMany(() => TemplateStyleEntity, (style) => style.templates, {
    cascade: true,
  })
  @JoinTable({
    name: 'template_template_styles',
    joinColumn: {
      name: 'templateId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'styleId',
      referencedColumnName: 'id',
    },
  })
  styles: TemplateStyleEntity[];
}
