import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('upload')
export class UploadEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  slug: string;

  @Column({})
  filename: string;

  @Column({})
  relativePath: string;

  @Column({})
  mimetype: string;

  @Column({})
  size: number;

  @Column({ default: false })
  isTemporary: boolean;

  @Column({ default: true })
  isPrivate: boolean;
}
